import React, { useEffect, useState } from 'react';
import { AuthenticatedState, AuthenticatedStore } from './Authenticated.store';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './Authenticated.scss';
import { WorkforceHeader } from '@churchofjesuschrist/eden-workforce-header';

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
            <div className="global-navigation">
                <div className="global-navigation__wordmark">
                    <a className="wordmark--mainLogoLink" href="https://www.churchofjesuschrist.org?lang=eng"
                       title="The Church of Jesus Christ of Latter-day Saints">
                        <div id="slimLogo">The Church of Jesus Christ of Latter-day Saints</div>
                    </a>
                </div>
                <WorkforceHeader name="Audio Recordings"/>
                <div className="sub-navigation">
                    <div className="sub-navigation__link"><NavLink to="record">Record</NavLink></div>
                    <div className="sub-navigation__link"><NavLink to="review">Review</NavLink></div>
                    <div className="sub-navigation__link"><NavLink to="voice-assignments">Voice Assignments</NavLink></div>
                    <div className="sub-navigation__link"><NavLink to="review-assignments">Review Assignments</NavLink></div>
                    <div className="sub-navigation__link"><NavLink to="reports">Reports</NavLink></div>
                    <div className="sub-navigation__link"><NavLink to="users">Users</NavLink></div>
                    <div className="sub-navigation__link"><NavLink to="import">Import</NavLink></div>
                    <div className="sub-navigation__link"><NavLink to="download">Download</NavLink></div>
                </div>
            </div>
            <Outlet />
        </div>
    );
}

// TODO: Investigate using custom hooks for the store (see: https://youtu.be/MFj_S0Nof90):
// function useStore<T>(setState: React.Dispatch<React.SetStateAction<T>>) {
//
// }
