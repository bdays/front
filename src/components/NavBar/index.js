import React from 'react';
import './style.scss';

function NavBar({logo, themeName, children}) {
    return (
        <div className={themeName + ' router'}>
            <ul className='router-ul'>
                <li className={'router-li '+themeName}>
                    <img className='icon-bDay' src={logo} alt='logo'/>
                </li>
                {children}
            </ul>
        </div>
    );
}

export default NavBar;
