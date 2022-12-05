import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { Public } from './app/features/public/Public';
import { Authenticated } from './app/features/authenticated/Authenticated';
import { App } from './app/App';

const router = createBrowserRouter([
    {
        path: "/", element: <App />, children: [
            { path: "", element: <Navigate to="public" /> },
            { path: "public", element: <Public /> },
            { path: "authenticated", element: <Authenticated /> },
        ]
    },
]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
