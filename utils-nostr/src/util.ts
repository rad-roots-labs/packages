import { v4 } from "uuid";

export const time_now_ms = (): number => Math.floor(new Date().getTime() / 1000);

export const uuidv4 = (): string => v4();