module Caviar {
    export interface CaviarViewEventListener {
        event: string;
        callback: EventListener;
    }
}