import React from 'react';
import './App.scss';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Primary, Secondary } from '@churchofjesuschrist/eden-buttons';

export function App() {
    const navigate = useNavigate();

    function publicClickHandler() {
        navigate('/public')
    }

    function authenticatedClickHandler() {
        navigate('/authenticated')
    }

    return (
        <>
            <div>
                <Link to="/public">Public</Link> | <Link to="/authenticated">Authenticated</Link>
            </div>
            <div>
                <Primary onClick={publicClickHandler}>Public</Primary>
                <Secondary onClick={authenticatedClickHandler}>Authenticated</Secondary>
            </div>

            <Outlet />
        </>
    );
}
