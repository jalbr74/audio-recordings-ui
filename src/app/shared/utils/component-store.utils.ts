import { combineLatest, distinctUntilChanged, map, Observable, shareReplay, Subject, Subscription } from 'rxjs';
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

    stateTracker: Subject<T> = new Subject<T>();
    state$ = this.stateTracker.asObservable();

    /**
     * Saves off the setter returned from a call to the React hook: useState, such as:
     *
     * const [state, setState] = useState<MyComponentState>({});
     */
    constructor(protected setState: React.Dispatch<React.SetStateAction<T>>) {
    }

    /**
     * Creates a selector, which is a way to subscribe to a specific portion of the state, for example:
     *
     * message$ = store.select<string>((state: MyState) => state.message);
     */
    select<ValueType>(selectorFn: (state: T) => ValueType): Observable<ValueType> {
        return this.state$.pipe(
            map(selectorFn),
            distinctUntilChanged(),
            shareReplay({
                refCount: true,
                bufferSize: 1,
            })
        );
    }

    /**
     * Provides a way for subclasses to define state updaters, such as the following:
     *
     * setMessage = store.updater<string>((state: MyState, message: string) => {
     *     return { ...state, message };
     * });
     */
    updater<ValueType>(updaterFn: (state: T, value: ValueType) => T): (value?: ValueType) => void {
        return (value?: ValueType) => this.setState((state: T) => {
            const newState = updaterFn(state, value as ValueType);
            this.stateTracker.next(newState);

            return newState;
        });
    }

    /**
     * Provides a way for subclasses to define effects, such as the following:
     *
     *  retrieveMessage = store.effect<void>((origin$: Observable<void>) => {
     *      return origin$.pipe(
     *          switchMap(() => {
     *              return fromPromise(fetch('/api/message')).pipe(
     *                  switchMap((response: Response) => {
     *                      return response.json();
     *                  }),
     *                  catchError((error) => {
     *                      return EMPTY;
     *                  })
     *              )
     *          }),
     *          tap((message: string) => {
     *              this.setMessage(message);
     *          })
     *      );
     *  });
     */
    effect<ObservableType>(generator: (source$: Observable<ObservableType>) => Observable<unknown>) {
        const origin$ = new Subject<ObservableType>();
        this.effects.push(generator(origin$));

        return ((value?: ObservableType): void => {
            origin$.next(value as ObservableType);
        });
    }

    /**
     * Provides a way to make the effects, defined by this component store, active.
     */
    subscribe(): Subscription {
        return combineLatest(this.effects).subscribe();
    }
}

/**
 * Provides a way to simplify the use of ComponentStore into a handy hook so it can be used as follows:
 *
 * const [store, state] = useComponentStore(AuthenticatedStore, INITIAL_STATE);
 */
export function useComponentStore<StoreType extends ComponentStore<StateType>, StateType>(
    ComponentStoreConstructor: new (setState: React.Dispatch<React.SetStateAction<StateType>>) => StoreType,
    initialState: StateType,
    initFn?: (store: StoreType) => void
): [StoreType, StateType] {
    const [state, setState] = useState<StateType>(initialState);
    const store = useMemo<StoreType>(() => new ComponentStoreConstructor(setState), [ComponentStoreConstructor]);

    useEffect(() => {
        const subscription = store.subscribe();

        // Perform any store initialization now that the subscription is active:
        initFn?.(store);

        return () => subscription.unsubscribe();
    }, [store]);

    return [store, state];
}
