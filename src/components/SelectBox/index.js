import React from 'react';
import './style.scss'

function SelectBox({value, children, onChange,className}) {
    return (
        <div className={"custom-select "+className}>
            <select value={value} onChange={(e) => onChange(e.target.value)}>
                {children.map((item, i) => (
                    <option key={'option'+i} value={item.value}>{item.text}</option>

                ))}
            </select>
        </div>
    );
}

export default SelectBox;
