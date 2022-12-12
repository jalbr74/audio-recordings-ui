import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import React, { useEffect, useMemo, useState } from 'react';

/**
 * Provides a way to create RxJS effects, which are handy when a component wants to communicate with the outside world.
 * This should be subclassed so components can use it by doing the following:
 *
 * const [state, setState] = useState<MyComponentState>({});
 * const store = useStore(() => new MyComponentStore(setState));
 *
 * A component must define a state (such as: MyComponentState) and a store (such as MyComponentStore).
 */
export class ComponentStore<T> {
    effects: Observable<any>[] = [];

    constructor(protected setState: React.Dispatch<React.SetStateAction<T>>) {
        console.log('ComponentStore constructed');
    }

    effect<ObservableType>(generator: (source$: Observable<ObservableType>) => Observable<unknown>) {
        const origin$ = new Subject<ObservableType>();
        this.effects.push(generator(origin$));

        return ((value?: ObservableType): void => {
            origin$.next(value as ObservableType);
        });
    }

    subscribe(): Subscription {
        return combineLatest(this.effects).subscribe();
    }

    /**
     * Subclasses can override this for first-time initialization.
     */
    init(): void {
    }
}

export function useComponentStore<StoreType extends ComponentStore<StateType>, StateType>(
    ComponentStoreConstructor: new (setState: React.Dispatch<React.SetStateAction<StateType>>) => StoreType,
    initialState: StateType
): [StoreType, StateType] {
    const [state, setState] = useState(initialState);
    const store = useMemo(() => new ComponentStoreConstructor(setState), [ComponentStoreConstructor]);

    useEffect(() => {
        const subscription = store.subscribe();

        // Perform any store initialization:
        store.init();

        return () => subscription.unsubscribe();
    }, [store]);

    return [store, state];
}
