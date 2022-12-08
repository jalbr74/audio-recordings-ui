import { Link, Outlet } from 'react-router-dom';
import React from 'react';
import { WorkforceHeader } from '@churchofjesuschrist/eden-workforce-header';

import './Public.scss';
import SubNavigation from '@churchofjesuschrist/eden-sub-navigation';

export function Public() {
    const items = [
        { text: 'Record', current: true },
        { text: 'Review', },
        { text: 'Voice Assignments' },
        { text: 'Review Assignments' },
        { text: 'Reports' },
        { text: 'Users' },
        { text: 'Import' },
        { text: 'Download' },
    ];

    const title = {
        href: 'https://www.churchofjesuschrist.org',
        text: 'Temples'
    };

    return (
        <div className="Public">
            <div className="wordmark">
                <a className="wordmark--mainLogoLink" href="https://www.churchofjesuschrist.org?lang=eng"
                   title="The Church of Jesus Christ of Latter-day Saints">
                    <div id="slimLogo">The Church of Jesus Christ of Latter-day Saints</div>
                </a>
            </div>
            <WorkforceHeader name="Audio Recordings"/>
            <SubNavigation items={items} />
            <Outlet/>
        </div>
    );
}
