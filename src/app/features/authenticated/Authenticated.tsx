import React, { useEffect, useState } from 'react';
import { AuthenticatedState, AuthenticatedStore } from './Authenticated.store';
import { Outlet, useNavigate } from 'react-router-dom';
import './Authenticated.scss';

export function Authenticated() {
    const [state, setState] = useState<AuthenticatedState>({});
    const [store] = useState(() => new AuthenticatedStore(setState));

    useEffect(() => {
        // TODO: Remove this:
        console.log('useEffect called');

        const subscription = store.subscribe();
        store.fetchAuthenticatedUser();

        return () => subscription.unsubscribe();
    }, [store]);

    const navigate = useNavigate();

    if (!state.authenticatedUser) {
        if (state.authenticationFailed) {
            // Couldn't authenticate. Redirect to the public login page:
            navigate('/public/login');
            return (<div>Redirecting to login page...</div>);
        }

        return <div>Checking authentication...</div>;
    }

    return (
        <div className="Authenticated">
            <div className="Authenticated-unity-header">Header</div>
            <div className="Authenticated-unity-banner">Banner</div>

            <div className="Authenticated-navbar">Navbar</div>

            <Outlet />
        </div>
    );
}

// TODO: Investigate using custom hooks for the store (see: https://youtu.be/MFj_S0Nof90):
// function useStore<T>(setState: React.Dispatch<React.SetStateAction<T>>) {
//
// }
