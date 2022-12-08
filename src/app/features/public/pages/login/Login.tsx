import { Primary, Secondary } from '@churchofjesuschrist/eden-buttons';
import { Link } from 'react-router-dom';
import React from 'react';

import './Login.scss';

export function Login() {
    function loginHandler() {
        window.document.location = '/api/users/login';
    }

    return (
        <div className="Login">
            <div>
                Try to access the <Link to="/authenticated">Authenticated</Link> page.
            </div>

            <p className="explanation-text">
                You are currently not logged in. Press the Login button below to continue.
            </p>

            <Primary onClick={loginHandler}>Login</Primary>
        </div>
    );
}
