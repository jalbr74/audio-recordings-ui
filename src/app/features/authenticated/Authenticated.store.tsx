import { catchError, EMPTY, map, Observable, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ComponentStore } from '../../shared/utils/component-store.utils';
import { AuthenticatedUser, AuthenticationError } from '../../shared/services/authenticated-user.types';
import { authenticatedUserService } from '../../shared/services/authenticated-user.service';
import React from 'react';

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

export const INITIAL_STATE: AuthenticatedState = {
    message: 'Old Message'
}

export class AuthenticatedStore extends ComponentStore<AuthenticatedState> {
    constructor(protected setState: React.Dispatch<React.SetStateAction<AuthenticatedState>>) {
        super(setState);

        this.message$.subscribe((message: string) => {
            console.log('New message: ' + message);
        });
    }

    message$ = this.select<string>((state: AuthenticatedState) => state.message);

    setProgressState = this.updater<ProgressState>((state: AuthenticatedState, progressState: ProgressState) => {
        return { ...state, progressState };
    });

    clearProgressState = this.updater<void>((state: AuthenticatedState) => {
        return {
            ...state, progressState: {
                inProgress: false,
                message: ''
            }
        };
    });

    setAuthenticatedUser = this.updater<AuthenticatedUser>((state: AuthenticatedState, authenticatedUser: AuthenticatedUser) => {
        return { ...state, authenticatedUser };
    });

    setAuthenticationFailed = this.updater<void>((state: AuthenticatedState) => {
        return { ...state, authenticationFailed: true };
    });

    setMessage = this.updater<string>((state: AuthenticatedState, message: string) => {
        return { ...state, message };
    });

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
