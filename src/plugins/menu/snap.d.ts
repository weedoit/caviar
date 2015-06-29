interface ISnapState {
    state: string;
}

interface ISnap {
    new (opt: any);
    open (): void;
    close (): void;
    state (): ISnapState;
}

declare var Snap: ISnap;