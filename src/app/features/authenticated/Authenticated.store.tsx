import { Observable, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { ComponentStore } from '../../shared/utils/component-store.utils';

export interface Person {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
}

export interface ErrorState {
    message: string;
    error: Error;
}

export interface ProgressState {
    message: string;
}

export interface PeopleState {
    people: Person[];
    errorState?: ErrorState;
    progressState?: ProgressState;
}

export class PeopleStore extends ComponentStore<PeopleState> {
    updatePeople(people: Person[]) {
        this.setState((prevState: PeopleState) => {
            return { ...prevState, people: people }
        });
    }

    addPerson(person: Person) {
        this.setState((prevState: PeopleState) => {
            return { ...prevState, people: [...prevState.people, person] }
        });
    }

    loadPeopleBatch1 = this.effect<void>((origin$: Observable<void>) => {
        return origin$.pipe(
            switchMap(() => {
                return fromPromise(fetch('/data/people-batch-1.json'))
            }),
            switchMap((data) => fromPromise(data.json() as Promise<Person[]>)),
            tap((people: Person[]) => {
                this.updatePeople(people);
            })
        );
    });

    loadPeopleBatch2 = this.effect<void>((origin$: Observable<void>) => {
        return origin$.pipe(
            switchMap(() => {
                return fromPromise(fetch('/data/people-batch-2.json'))
            }),
            switchMap((data) => fromPromise(data.json() as Promise<Person[]>)),
            tap((people: Person[]) => {
                this.updatePeople(people);
            })
        );
    });
}
