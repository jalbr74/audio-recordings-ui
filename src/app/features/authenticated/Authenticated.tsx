import { useEffect, useState } from 'react';
import { AuthenticatedState, AuthenticatedStore } from './Authenticated.store';

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

    return <div>Authenticated works!</div>;
}
