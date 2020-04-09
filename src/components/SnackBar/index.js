import React from "react";
import './style.scss';

function SnackBar({show, content,}) {
    if (!show) return <></>;
    return (<div className='snackbar'>{content}</div>);
}

export default SnackBar;
