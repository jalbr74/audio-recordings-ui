import { catchError, EMPTY, Observable, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ComponentStore } from '../../shared/utils/component-store.utils';
import { AuthenticatedUser } from '../../shared/types/authenticated-user.types';
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

    fetchAuthenticatedUser = this.effect<void>((origin$: Observable<void>) => {
        return origin$.pipe(
            switchMap(() => {
                this.setProgressState({ inProgress: true, message: 'Checking authentication' });

                return authenticatedUserService.getAuthenticatedUser().pipe(
                    catchError((error) => {
                        this.clearProgressState();

                        console.error(error);
                        return EMPTY;
                    })
                )
            }),
            tap((authenticatedUser: AuthenticatedUser) => {
                console.log('Authenticated user: %O', authenticatedUser);

                this.clearProgressState();
                this.setAuthenticatedUser(authenticatedUser);
            })
        );
    });
}
