import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import React from 'react';

/**
 * Provides a way to create RxJS effects, which are handy when a component wants to communicate with the outside world.
 */
export class ComponentStore<T> {
    effects: Observable<any>[] = [];

    constructor(protected setState: React.Dispatch<React.SetStateAction<T>>) {
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
}
