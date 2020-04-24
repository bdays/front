import React, {useState} from 'react';
import './style.scss'

import imgShow from "../../image/iconShowPassword.png";

function InputPassword({className, value, handleChange}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="pass">
            <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password.."
                className={className}
                onChange={handleChange}
                value={value}
            />
            <button onClick={() => setShowPassword(!showPassword)}><img
                src={imgShow} alt='show' title='Show password'/></button>

        </div>
    );
}

export default InputPassword;