import { catchError, EMPTY, map, Observable, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ComponentStore } from '../../shared/utils/component-store.utils';
import { AuthenticatedUser, AuthenticationError } from '../../shared/services/authenticated-user.types';
import { authenticatedUserService } from '../../shared/services/authenticated-user.service';

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
    init() {
        this.fetchAuthenticatedUser();
    }

    setProgressState(progressState: ProgressState) {
        this.setState((prevState: AuthenticatedState) => {
            return { ...prevState, progressState };
        });
    }

    clearProgressState() {
        this.setState((prevState: AuthenticatedState) => {
            return {
                ...prevState, progressState: {
                    inProgress: false,
                    message: ''
                }
            };
        });
    }

    setAuthenticatedUser(authenticatedUser: AuthenticatedUser) {
        this.setState((prevState: AuthenticatedState) => {
            return { ...prevState, authenticatedUser };
        });
    }

    setAuthenticationFailed = this.updater((state: AuthenticatedState) => {
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
