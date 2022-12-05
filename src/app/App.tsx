import React from 'react';
import './App.scss';
import { Link, Outlet, useNavigate } from 'react-router-dom';

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
                <button onClick={publicClickHandler}>Public</button>
                <button onClick={authenticatedClickHandler}>Authenticated</button>
            </div>

            <Outlet />
        </>
    );
}
