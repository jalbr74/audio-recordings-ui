import React from 'react';
import { AuthenticatedStore, INITIAL_STATE } from './Authenticated.store';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './Authenticated.scss';
import { WorkforceHeader } from '@churchofjesuschrist/eden-workforce-header';
import { Primary } from '@churchofjesuschrist/eden-buttons';
import { useComponentStore } from '../../shared/utils/component-store.utils';

export function Authenticated() {
    const [state, store] = useComponentStore(INITIAL_STATE, AuthenticatedStore);
    const navigate = useNavigate();

    if (!state.authenticatedUser) {
        if (state.authenticationFailed) {
            // Couldn't authenticate. Redirect to the public login page:
            navigate('/public/login');
            return (<div>Redirecting to login page...</div>);
        }

        // We may just be waiting for the fetch call to finish
        return <div>Checking authentication...</div>;
    }

    function changeMessage() {
        store.setMessage('New Message');
    }

    return (
        <div className="Authenticated">
            <div>
                Message: {state.message}
            </div>
            <div>
                <Primary onClick={changeMessage}>Change Message</Primary>
            </div>

            <div className="global-navigation">
                <div className="global-navigation__wordmark">
                    <a className="wordmark--mainLogoLink" href="https://www.churchofjesuschrist.org?lang=eng"
                       title="The Church of Jesus Christ of Latter-day Saints">
                        <div id="slimLogo">The Church of Jesus Christ of Latter-day Saints</div>
                    </a>
                </div>
                <WorkforceHeader name="Audio Recordings"/>
                <nav className="sub-navigation">
                    <NavLink to="record">Record</NavLink>
                    <NavLink to="review">Review</NavLink>
                    <NavLink to="voice-assignments">Voice Assignments</NavLink>
                    <NavLink to="review-assignments">Review Assignments</NavLink>
                    <NavLink to="reports">Reports</NavLink>
                    <NavLink to="users">Users</NavLink>
                    <NavLink to="import">Import</NavLink>
                    <NavLink to="download">Download</NavLink>
                </nav>
            </div>
            <Outlet />
        </div>
    );
}
