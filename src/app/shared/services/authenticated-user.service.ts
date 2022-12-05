import { map, Observable, switchMap, tap } from 'rxjs';
import { AuthenticatedUser } from '../types/authenticated-user.types';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

export class AuthenticatedUserService {
    authenticatedUser: AuthenticatedUser;

    constructor() {
        this.authenticatedUser = {
            id: -1,
            ldsAccountId: -1,
            userName: ''
        };
    }

    getAuthenticatedUser(): Observable<AuthenticatedUser> {
        return fromPromise(fetch('/api/users/me')).pipe(
            switchMap((response: Response) => response.json()),
            tap((authenticatedUser: AuthenticatedUser) => {
                this.authenticatedUser = authenticatedUser;
            })
        );
    }
}

export const authenticatedUserService = new AuthenticatedUserService();
