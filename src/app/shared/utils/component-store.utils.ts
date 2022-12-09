import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import React, { useEffect, useState } from 'react';

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

/**
 * Custom hook for making it easier to work with ComponentStore implementations.
 * Components will typically do something like this:
 *
 * const [state, setState] = useState<MyComponentState>({});
 * const store = useStore(() => new MyComponentStore(setState));
 */
export function useStore<T extends ComponentStore<any>>(initialState: () => T): T {
    const [store] = useState(initialState);

    useEffect(() => {
        // TODO: Why is this called twice in development (when <React.StrictMode> is used)?
        // console.log('useEffect in useStore called');

        const subscription = store.subscribe();
        store.init();

        return () => subscription.unsubscribe();
    }, [store]);

    return store;
}
