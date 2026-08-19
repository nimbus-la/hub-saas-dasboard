import { AlertTone, NotifyOptions } from "@/interfaces/components";



export interface ApiAlert {
    tone: AlertTone;
    message: string;
}



export type ApiAlertSink = (source: unknown, options?: NotifyOptions) => void;