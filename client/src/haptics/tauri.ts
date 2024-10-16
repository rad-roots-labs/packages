import {
    impactFeedback,
    notificationFeedback,
    selectionFeedback,
    vibrate,
} from '@tauri-apps/plugin-haptics';
import type { IClientHaptics, IClientHapticsFeedback, IClientHapticsImpact } from './types';

export class TauriClientHaptics implements IClientHaptics {
    public impact = async (opts: IClientHapticsImpact = `medium`): Promise<void> => {
        try {
            await impactFeedback(opts);
        } catch (e) { };
    };

    public vibrate = async (duration: number = 10): Promise<void> => {
        try {
            await vibrate(duration);
        } catch (e) { };
    };

    public feedback = async (opts: IClientHapticsFeedback): Promise<void> => {
        try {
            await notificationFeedback(opts);
        } catch (e) { };
    };

    public selection = async (): Promise<void> => {
        try {
            await selectionFeedback();
        } catch (e) { };
    };
}
