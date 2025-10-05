export class EventEmitter<T> {
    private listeners: ((payload: T) => void)[] = [];

    on(listener: (payload: T) => void): void {
        this.listeners.push(listener);
    }

    emit(payload: T): void {
        for (const listener of this.listeners) {
            listener(payload);
        }
    }
}
