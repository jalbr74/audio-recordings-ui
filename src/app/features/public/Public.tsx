import { Link, Outlet } from 'react-router-dom';
import React from 'react';
import { WorkforceHeader } from '@churchofjesuschrist/eden-workforce-header';

import './Public.scss';

export function Public() {
    return (
        <div className="Public">
            <div className="global-navigation">
                <div className="global-navigation__wordmark">
                    <a className="wordmark--mainLogoLink" href="https://www.churchofjesuschrist.org?lang=eng"
                       title="The Church of Jesus Christ of Latter-day Saints">
                        <div id="slimLogo">The Church of Jesus Christ of Latter-day Saints</div>
                    </a>
                </div>
                <WorkforceHeader name="Audio Recordings"/>
            </div>
            <Outlet/>
        </div>
    );
}
