// скрипт для запуска этого файла: npm run emitter

type Listener<T extends Array<unknown>> = (...args: T) => void;

export class EventEmitter<EventMap extends Record<string, Array<unknown>>> {
    _events: { [K in keyof EventMap]?: Set<Listener<EventMap[K]>> } = {};

    on<K extends keyof EventMap>(
        eventName: K,
        listener: Listener<EventMap[K]>
    ) {
        if (!this._events[eventName]) {
            this._events[eventName] = new Set();
        }
        this._events[eventName].add(listener);
    }

    off<K extends keyof EventMap>(
        eventName: K,
        listener: Listener<EventMap[K]>
    ) {
        if (this._events[eventName]) {
            this._events[eventName].delete(listener);
            if (this._events[eventName]?.size === 0) {
                delete this._events[eventName];
            }
        }
    }

    emit<K extends keyof EventMap>(eventName: K, ...args: EventMap[K]) {
        const listeners = this._events[eventName] ?? new Set();
        for (const listener of listeners) {
            listener(...args);
        }
    }
}
// типизация EventEmitter настроена так, чтобы можно было уточнить,
// какие события могут в нем находиться и какой тип данных могут принимать методы
// поэтому удобно при использовании прописать эти типы

// ниже приведен пример использования эмиттера с выводами в консоль данных на каждом этапе
// для запуска используйте скрипт npm run emitter

type TRepoExample = { id: number; name: string }; // репозиторий
type TEventMapExample = { edit: [TRepoExample]; delete: [number] }; // на какие события можно подписаться и какой тип данных передается подписчику

const emitter = new EventEmitter<TEventMapExample>();

const editExample = (repo: TRepoExample) => console.log(repo);
const deleteExample = (id: number) => console.log(id);
const deleteExampleSecond = (id: number) => console.log(id);

emitter.on("edit", editExample);
emitter.on("delete", deleteExample);
emitter.on("delete", deleteExampleSecond);

console.log("После подписок в нашем инстансе эмиттера хранятся:");
console.log(emitter._events);

console.log("Тут вызываем обработчик, подписанный на edit:");
emitter.emit("edit", { id: 123, name: "123" });

emitter.off("edit", editExample);
console.log("Тут удалили обработчик с edit, теперь в инстансе:");
console.log(emitter._events);
