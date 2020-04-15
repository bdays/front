import React, {useState} from 'react';
import './style.scss'

function SelectBox({value, children, onChange}) {
    return (
        <div className="custom-select">
            <select value={value} onChange={(e)=>onChange(e.target.value)}>
                <option value="1">Administrator</option>
                <option value="2">Simple user</option>
            </select>
        </div>
    );
}

export default SelectBox;
