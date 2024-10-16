import type { ImpactFeedbackStyle, NotificationFeedbackType } from "@tauri-apps/plugin-haptics";

export type IClientHapticsImpact = ImpactFeedbackStyle;
export type IClientHapticsFeedback = NotificationFeedbackType;

export type IClientHaptics = {
    impact: (opts: IClientHapticsImpact) => Promise<void>;
    vibrate: (duration?: number) => Promise<void>;
    feedback: (opts: IClientHapticsFeedback) => Promise<void>;
    selection: () => Promise<void>;
};