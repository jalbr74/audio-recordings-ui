import React, { useEffect, useState } from 'react';
import { AuthenticatedState, AuthenticatedStore } from './Authenticated.store';
import { Outlet, useNavigate } from 'react-router-dom';

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

    if (state.authenticationFailed) {
        // Couldn't authenticate. Redirect to the public login page:
        navigate('/public/login');
        return (<div>Redirecting...</div>);
    }

    return <Outlet></Outlet>;
}

// TODO: Investigate using custom hooks for the store (see: https://youtu.be/MFj_S0Nof90):
// function useStore<T>(setState: React.Dispatch<React.SetStateAction<T>>) {
//
// }
