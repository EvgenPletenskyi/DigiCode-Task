export type Listener<Payload> = (payload: Payload) => void;

export class EventEmitter<T> {
    private listeners = new Set<Listener<T>>();

    on(listener: Listener<T>): () => void {
        this.listeners.add(listener);
        return () => this.off(listener);
    }

    off(listener: Listener<T>): void {
        this.listeners.delete(listener);
    }

    emit(payload: T): void {
        for (const listener of [...this.listeners]) {
            listener(payload);
        }
    }
}

export class EventBus<Events extends Record<string, unknown>> {
    private channels = new Map<keyof Events, EventEmitter<any>>();

    on<K extends keyof Events>(event: K, listener: Listener<Events[K]>): () => void {
        return this.getChannel(event).on(listener);
    }

    emit<K extends keyof Events>(event: K, payload: Events[K]): void {
        const channel = this.channels.get(event) as EventEmitter<Events[K]> | undefined;
        channel?.emit(payload);
    }

    private getChannel<K extends keyof Events>(event: K): EventEmitter<Events[K]> {
        let channel = this.channels.get(event) as EventEmitter<Events[K]> | undefined;
        if (!channel) {
            channel = new EventEmitter<Events[K]>();
            this.channels.set(event, channel);
        }
        return channel;
    }
}

export type AppEvents = {
    "model:gravityChanged": number;
    "model:spawnRateChanged": number;
    "shapes:statsChanged": { count: number; area: number };
    "hud:request:setGravity": number;
    "hud:request:setSpawnRate": number;
};

export const eventBus = new EventBus<AppEvents>();
