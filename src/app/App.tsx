import React from 'react';
import './App.scss';
import { Outlet, useNavigate } from 'react-router-dom';

export function App() {
    const navigate = useNavigate();

    function publicClickHandler() {
        navigate('/public')
    }

    function authenticatedClickHandler() {
        navigate('/authenticated')
    }

    return (<Outlet />);
}
