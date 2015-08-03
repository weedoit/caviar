module Caviar {
    export interface CaviarViewEventListener {
        event: string;
        selector: string;
        callback: Function;
    }
}
