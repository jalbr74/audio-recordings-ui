import React from 'react';

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { App } from './app/App';
import { Public } from './app/features/public/Public';
import { Authenticated } from './app/features/authenticated/Authenticated';
import { Router as RemixRouter } from '@remix-run/router/dist/router';
import { Download } from './app/features/authenticated/pages/download/Download';
import { Import } from './app/features/authenticated/pages/import/Import';
import { Record } from './app/features/authenticated/pages/record/Record';
import { Reports } from './app/features/authenticated/pages/reports/Reports';
import { Review } from './app/features/authenticated/pages/review/Review';
import { ReviewAssignments } from './app/features/authenticated/pages/review-assignments/ReviewAssignments';
import { Users } from './app/features/authenticated/pages/users/Users';
import { VoiceAssignments } from './app/features/authenticated/pages/voice-assignments/VoiceAssignments';
import { Login } from './app/features/public/pages/login/Login';
import { Landing } from './app/features/authenticated/pages/landing/Landing';

export const router: RemixRouter = createBrowserRouter([
    {
        path: '/', element: <App />, children: [
            { path: '', element: <Navigate to='authenticated' /> },
            {
                path: 'authenticated', element: <Authenticated />, children: [
                    { path: '', element: <Landing /> },
                    { path: 'download', element: <Download /> },
                    { path: 'import', element: <Import /> },
                    { path: 'record', element: <Record /> },
                    { path: 'reports', element: <Reports /> },
                    { path: 'review', element: <Review /> },
                    { path: 'review-assignments', element: <ReviewAssignments /> },
                    { path: 'users', element: <Users /> },
                    { path: 'voice-assignments', element: <VoiceAssignments /> },
                ]
            },
            {
                path: 'public', element: <Public />, children: [
                    { path: '', element: <Navigate to='login' /> },
                    { path: 'login', element: <Login /> }
                ]
            },
        ]
    },
]);
