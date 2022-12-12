import { catchError, EMPTY, map, Observable, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ComponentStore } from '../../shared/utils/component-store.utils';
import { AuthenticatedUser, AuthenticationError } from '../../shared/services/authenticated-user.types';
import { authenticatedUserService } from '../../shared/services/authenticated-user.service';
import React, { useEffect, useMemo, useState } from 'react';

export interface ErrorState {
    message: string;
    error: Error;
}

export interface ProgressState {
    inProgress: boolean;
    message: string;
}

export interface AuthenticatedState {
    message: string;
    authenticationAttempted?: boolean;
    authenticationFailed?: boolean;
    authenticatedUser?: AuthenticatedUser;
    errorState?: ErrorState;
    progressState?: ProgressState;
}

export class AuthenticatedStore extends ComponentStore<AuthenticatedState> {
    setProgressState(progressState: ProgressState) {
        this.setState((prevState: AuthenticatedState) => {
            return { ...prevState, progressState }
        });
    }

    clearProgressState() {
        this.setState((prevState: AuthenticatedState) => {
            return {
                ...prevState, progressState: {
                    inProgress: false,
                    message: ''
                }
            }
        });
    }

    setAuthenticatedUser(authenticatedUser: AuthenticatedUser) {
        this.setState((prevState: AuthenticatedState) => {
            return { ...prevState, authenticatedUser }
        });
    }

    setAuthenticationFailed() {
        this.setState((prevState: AuthenticatedState) => {
            return { ...prevState, authenticationFailed: true }
        });
    }

    setMessage(newMessage: string) {
        this.setState((prevState: AuthenticatedState) => {
            return { ...prevState, message: newMessage }
        });
    }

    fetchAuthenticatedUser = this.effect<void>((origin$: Observable<void>) => {
        return origin$.pipe(
            switchMap(() => {
                this.setProgressState({ inProgress: true, message: 'Checking authentication' });

                return authenticatedUserService.getAuthenticatedUser().pipe(
                    map((authenticatedUser: AuthenticatedUser | AuthenticationError) => {
                        if (authenticatedUser.hasOwnProperty('error')) {
                            const error = authenticatedUser as AuthenticationError;
                            console.error('An error occurred trying to get the authenticated user information. Error: %O', error);
                            throw error;
                        }

                        // console.log('Authenticated user: %O', authenticatedUser);
                        return authenticatedUser as AuthenticatedUser;
                    }),
                    catchError((error) => {
                        this.clearProgressState();
                        this.setAuthenticationFailed();

                        return EMPTY;
                    })
                )
            }),
            tap((authenticatedUser: AuthenticatedUser) => {
                this.clearProgressState();
                this.setAuthenticatedUser(authenticatedUser);
            })
        );
    });
}

/**
 * Provides a handy hook for making working with this store more convenient.
 */
// export function useAuthenticatedStore(): [AuthenticatedState, AuthenticatedStore] {
//     const initialState: AuthenticatedState = {
//         message: 'Old Message'
//     };
//
//     const [state, setState] = useState(initialState);
//     const store = useMemo(() => new AuthenticatedStore(setState), []);
//
//     useEffect(() => {
//         const subscription = store.subscribe();
//
//         // Perform any store initialization:
//         store.fetchAuthenticatedUser();
//
//         return () => subscription.unsubscribe();
//     }, [store]);
//
//     return [state, store];
// }

export function useComponentStore(initialState: AuthenticatedState, constructorFn: (setState: React.Dispatch<React.SetStateAction<AuthenticatedState>>) => AuthenticatedStore): [AuthenticatedState, AuthenticatedStore] {
    const [state, setState] = useState(initialState);
    const store = useMemo(() => constructorFn(setState), []);

    useEffect(() => {
        const subscription = store.subscribe();

        // Perform any store initialization:
        store.fetchAuthenticatedUser();

        return () => subscription.unsubscribe();
    }, [store]);

    return [state, store];
}
