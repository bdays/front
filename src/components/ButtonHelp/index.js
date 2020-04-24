import React from 'react';
import './style.scss';
import Button from "../Button";


function ButtonHelp({onClick, children, tooltipText,disabled}) {
    return (
        <Button onClick={onClick} className="btn-help tooltip" disabled={disabled}>{children}
            <span className="tooltip-text">{tooltipText}</span></Button>
    );
}

export default ButtonHelp;
