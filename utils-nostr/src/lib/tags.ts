import { INostrClassified, INostrJobRequest, NostrEventTagClient, NostrEventTagLocation, NostrEventTagMediaUpload, NostrEventTagPrice, NostrEventTagQuantity, type INostrFollow, type NostrEventTag, type NostrEventTags } from "$root";
import { ngeotags, type InputData as NostrGeotagsInputData } from "nostr-geotags";

export const tag_client = (opts: NostrEventTagClient, d_tag?: string): NostrEventTag => {
    const tag = [`client`, opts.name];
    if (d_tag) tag.push(`31990:${opts.pubkey}:${d_tag}`);
    tag.push(opts.relay);
    return tag;
};

export const tags_follow_list = (list: INostrFollow[]): NostrEventTags => {
    return list.map(({ public_key, relay_url, contact_name }) => {
        const entry = [`p`, public_key];
        if (relay_url) entry.push(relay_url);
        if (contact_name) entry.push(contact_name);
        return entry;
    });
};

export const tag_classified_quantity = (opts: NostrEventTagQuantity): NostrEventTag => {
    const tag = [`quantity`, opts.amt, opts.unit];
    if (opts.label) tag.push(opts.label);
    return tag;
};

export const tag_classified_price = (opts: NostrEventTagPrice): NostrEventTag => {
    const tag = [`price`, opts.amt, opts.currency, opts.qty_amt, opts.qty_unit];
    return tag;
};

export const tag_classified_image = (opts: NostrEventTagMediaUpload): NostrEventTag => {
    const tag = [`image`, opts.url];
    if (opts.size) tag.push(`${opts.size.w}x${opts.size.h}`)
    return tag;
};

export const tag_classified_location = (opts: NostrEventTagLocation): NostrEventTag => {
    const tag = [`location`];
    if (opts.city) tag.push(opts.city);
    if (opts.region_code && !isNaN(parseInt(opts.region_code))) tag.push(opts.region_code);
    else if (opts.region) tag.push(opts.region); //@todo 
    if (opts.country_code) tag.push(opts.country_code);
    return tag;
};

export const tags_classified_location_geotags = (opts: NostrEventTagLocation): NostrEventTags => {
    return ngeotags(
        {
            lat: opts.lat,
            lon: opts.lng,
            city: opts.city,
            regionName: opts.region,
            countryName: opts.country,
            countryCode: opts.country_code
        } satisfies NostrGeotagsInputData,
        {
            geohash: true,
            gps: true,
            city: true,
            iso31662: true,
        });
};


export const tags_classified = (opts: INostrClassified): NostrEventTags => {
    const { d_tag, listing, quantity, price, location } = opts;
    const tags: NostrEventTags = [[`d`, d_tag]];
    if (opts.client) tags.push(tag_client(opts.client, opts.d_tag));
    for (const [k, v] of Object.entries(listing)) if (v) tags.push([k, v]);
    for (const quantity_tags of quantity) tags.push(tag_classified_quantity(quantity_tags));
    for (const price_tags of price) tags.push(tag_classified_price(price_tags));
    tags.push(tag_classified_location(location));
    if (opts.images) for (const image_tags of opts.images) tags.push(tag_classified_image(image_tags));
    tags.push(...tags_classified_location_geotags(location));
    return tags;
};

export const tags_job_request = (opts: INostrJobRequest): NostrEventTags => {
    const tag_i: string[] = [`i`];
    if (`classified` in opts.input && opts.input?.classified) {
        const { classified: event_request } = opts.input;
        let marker = `*`;
        let data = `*`;
        if (event_request.marker && `order` in event_request.marker) {
            marker = `order`;
            data = JSON.stringify({ event: { id: event_request.id }, order: event_request.marker.order });
        }
        tag_i.push(...[data, `text`, event_request.relay, marker]);
        tag_i.push(...(opts.input.tags || []))
    }

    const tags: NostrEventTags = [tag_i];
    tags.push(...(opts.tags || []))
    return tags;
};
