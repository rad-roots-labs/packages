import type { NDKEvent } from '@nostr-dev-kit/ndk';
import type NDKSvelte from '@nostr-dev-kit/ndk-svelte';
import { derived, writable, type Readable, type Unsubscriber, type Writable } from 'svelte/store';

const E_REF = 'e_ref';

export interface NostrEventsClassifiedBundle {
    event: NDKEvent;
    job_results: NDKEvent[];
    job_feedback: NDKEvent[];
    loading: boolean;
    on_job_result?: (callback: (ev: NDKEvent) => void) => Unsubscriber;
}

export type NostrEventClassifiedSubscriptionServiceBundleStore = Readable<NostrEventsClassifiedBundle>;
export type NostrEventClassifiedSubscriptionServiceStore = Readable<Map<string, NostrEventsClassifiedBundle>>;
export type NostrEventClassifiedSubscriptionServiceOnJobResult = Readable<NDKEvent | undefined>;

export class NostrEventClassifiedSubscriptionService {
    private ndk: NDKSvelte;
    private subscription: ReturnType<NDKSvelte['subscribe']> | null = null;
    private filter_subscription: Unsubscriber | null = null;

    private filter_authors: Writable<string[] | undefined> = writable();
    private filter_kinds: Writable<number[]> = writable([30402, 6300, 7000]);

    private events_list: Writable<NDKEvent[]> = writable([]);
    private job_results: Writable<NDKEvent[]> = writable([]);
    private job_feedback: Writable<NDKEvent[]> = writable([]);

    private loading_map: Writable<Record<string, boolean>> = writable({});
    public loading: Readable<Record<string, boolean>> = this.loading_map;

    private timeouts: Map<string, number> = new Map();

    private bundle_map: Map<string, Writable<NostrEventsClassifiedBundle>> = new Map();

    private job_results_notification: Writable<NDKEvent | undefined> = writable(undefined);
    public readonly on_job_result: NostrEventClassifiedSubscriptionServiceOnJobResult = this.job_results_notification;

    public store: NostrEventClassifiedSubscriptionServiceStore;

    private load_complete = false;

    constructor(ndk: NDKSvelte) {
        this.ndk = ndk;

        this.store = derived(
            [this.events_list, this.job_results, this.job_feedback, this.loading_map],
            ([$events, $results, $feedback, $loading]) => {
                const map = new Map<string, NostrEventsClassifiedBundle>();

                for (const ev of $events) {
                    if (!ev.id) continue;

                    const bundle: NostrEventsClassifiedBundle = {
                        event: ev,
                        job_results: [],
                        job_feedback: [],
                        loading: Boolean($loading[ev.id]),
                        on_job_result: (callback: (ev: NDKEvent) => void): Unsubscriber => {
                            const ev_id = ev.id!;
                            const subscription_start_time = Date.now();

                            const unsubscribe = this.job_results.subscribe((list: NDKEvent[]) => {
                                for (const e of list) {
                                    const ref_id = e.tags?.find(([tag]) => tag === E_REF)?.[1];
                                    const ev_created_at = (e.created_at ?? 0) * 1000;
                                    if (ref_id === ev_id && ev_created_at > subscription_start_time) callback(e);
                                }
                            });

                            return unsubscribe;
                        },
                    };

                    map.set(ev.id, bundle);

                    if (!this.bundle_map.has(ev.id)) {
                        this.bundle_map.set(ev.id, writable(bundle));
                    } else {
                        this.bundle_map.get(ev.id)!.set(bundle);
                    }
                }

                for (const ev of $results) {
                    const ref = ev.tags?.find(([tag]) => tag === E_REF)?.[1];
                    if (ref && map.has(ref)) {
                        map.get(ref)!.job_results.push(ev);
                    }
                }

                for (const ev of $feedback) {
                    const ref = ev.tags?.find(([tag]) => tag === E_REF)?.[1];
                    if (ref && map.has(ref)) {
                        map.get(ref)!.job_feedback.push(ev);
                    }
                }

                for (const [id, bundle] of map.entries()) {
                    if (this.bundle_map.has(id)) {
                        this.bundle_map.get(id)!.set(bundle);
                    }
                }

                return map;
            }
        );

        this.filter_subscription = derived(
            [this.filter_authors, this.filter_kinds],
            ([$authors, $kinds]) => ({ authors: $authors, kinds: $kinds })
        ).subscribe(({ authors, kinds }) => {
            this.restart_subscription(authors, kinds);
        });

        this.restart_subscription(undefined, [30402, 6300, 7000]);
    }

    public set_filter_authors(authors: string[]): void {
        this.filter_authors.set(authors);
    }

    public set_filter_kinds(kinds: number[]): void {
        this.filter_kinds.set(kinds);
    }

    public get_event_bundle(eventId: string): NostrEventClassifiedSubscriptionServiceBundleStore | undefined {
        if (!this.bundle_map.has(eventId)) {
            return undefined;
        }
        return this.bundle_map.get(eventId)!;
    }

    public async await_job_request(event_id: string): Promise<NDKEvent> {
        this.loading_map.update(states => ({ ...states, [event_id]: true }));
        this.clear_timeout(event_id);

        try {
            const result = await new Promise<NDKEvent>((resolve, reject) => {
                let unsubscribe_res: Unsubscriber;
                let unsubscribe_fb: Unsubscriber;
                let seen_jobres = false;
                let seen_jobfb = false;

                const cleanup_subs = () => {
                    unsubscribe_res();
                    unsubscribe_fb();
                };

                const on_response = (ev: NDKEvent) => {
                    cleanup_subs();
                    this.clear_timeout(event_id);
                    resolve(ev);
                    setTimeout(() => {
                        this.loading_map.update(states => {
                            const { [event_id]: _, ...rest } = states;
                            return rest;
                        });
                    }, 0);
                };

                unsubscribe_res = this.job_results.subscribe(list => {
                    if (!seen_jobres) { seen_jobres = true; return; }
                    const ev = list.find(e =>
                        e.tags?.find(([t]) => t === E_REF)?.[1] === event_id
                    );
                    if (ev) on_response(ev);
                });

                unsubscribe_fb = this.job_feedback.subscribe(list => {
                    if (!seen_jobfb) { seen_jobfb = true; return; }
                    const ev = list.find(e =>
                        e.tags?.find(([t]) => t === E_REF)?.[1] === event_id
                    );
                    if (ev) on_response(ev);
                });

                const timeout_id = window.setTimeout(() => {
                    cleanup_subs();
                    this.loading_map.update(states => {
                        const { [event_id]: _, ...rest } = states;
                        return rest;
                    });
                    this.clear_timeout(event_id);
                    reject(new Error(`Timeout waiting for job result for event ${event_id}`));
                }, 7000);

                this.timeouts.set(event_id, timeout_id);
            });

            return result;
        } catch (err) {
            this.loading_map.update(states => {
                const { [event_id]: _, ...rest } = states;
                return rest;
            });
            throw err;
        }
    }

    private restart_subscription(authors?: string[], kinds: number[] = []): void {
        if (this.subscription) {
            this.subscription.stop();
            this.subscription = null;
        }

        this.events_list.set([]);
        this.job_results.set([]);
        this.job_feedback.set([]);
        this.clear_all_loading();

        this.load_complete = false;

        const filter = { kinds, ...(authors ? { authors } : {}) };
        const sub = this.ndk.subscribe(filter, { closeOnEose: false });

        sub.on('event', (event: NDKEvent) => {
            console.log(`event `, event.kind, event.id)
            switch (event.kind) {
                case 30402:
                    event.tags.forEach(i => {
                        if (i[0].includes(`price`) || i[0].includes(`quantity`)) console.log(i.join(`, `))
                    })
                    this.events_list.update(arr => [...arr, event]);
                    break;
                case 6300:
                    this.job_results.update(arr => [...arr, event]);
                    if (this.load_complete) {
                        this.job_results_notification.set(event);
                    }
                    break;
                case 7000:
                    this.job_feedback.update(arr => [...arr, event]);
                    break;
            }
        });

        sub.on('eose', () => {
            this.load_complete = true;
        });

        sub.start();
        this.subscription = sub;
    }

    private clear_timeout(event_id: string) {
        const to = this.timeouts.get(event_id);
        if (to !== undefined) {
            clearTimeout(to);
            this.timeouts.delete(event_id);
        }
    }

    private clear_all_loading() {
        for (const to of this.timeouts.values()) {
            clearTimeout(to);
        }
        this.timeouts.clear();
        this.loading_map.set({});
    }

    public destroy(): void {
        if (this.subscription) {
            this.subscription.stop();
            this.subscription = null;
        }
        if (this.filter_subscription) {
            this.filter_subscription();
            this.filter_subscription = null;
        }
        this.clear_all_loading();
    }
}
