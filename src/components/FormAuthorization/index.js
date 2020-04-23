import React, {useEffect, useState} from 'react';

import './style.scss'

import Button from "../Button";
import Input from "../Input";
import ErrorBlock from "../Error";
import {userLogin} from "../../Utils/user";
import {useDispatch} from "react-redux";
import {calendarLogin} from "../../Reducers/users";
import InputPassword from "../InputPassword";

function FormAuthorization({onSignIn, toClose}) {
    const dispatch = useDispatch();

    const [data, setData] = useState((localStorage.getItem('userData')) ? JSON.parse(localStorage.getItem('userData')) : {
        userName: '',
        password: ''
    });
    const [err, setErr] = useState('');
    const [checkboxValue, setCheckboxValue] = useState(false);

    useEffect(() => {
        window.addEventListener("keydown", escFunction, {once: true, capture: false});
        return () => {
            window.removeEventListener("keydown", escFunction, {once: true, capture: false});
        };
    });

    function escFunction(e) {
        if (e.keyCode === 13) {
            handleSignIn();
        }
    }

    const handleSignIn = () => {
        dispatch(calendarLogin(data)).then(res => {
            if (res.data) {

                userLogin(res.data);
                if (checkboxValue) {
                    localStorage.setItem('userData', JSON.stringify(data));
                }
                onSignIn();
                toClose();
            } else {
                setErr('Incorrect login or password');
            }
        }).catch(() => {
            setErr('Server error');
        })
    }

    const handleChange = (data) => {
        setData(data);
        setErr('');
    }

    return (
        <>
            <div className='form-authorization'>
                <label>Login
                    <Input
                        placeholder='Enter login..'
                        value={data.userName}
                        handleChange={(e) => handleChange({...data, userName: e.target.value})}/>
                </label>
                <label>Password
                    <InputPassword
                        placeholder='Enter password..'
                        value={data.password}
                        handleChange={(e) => handleChange({...data, password: e.target.value})}/>
                </label>
                <ErrorBlock content={err}/>
                <label>
                    <div className='checkbox'><input type="checkbox" value={checkboxValue}
                                                     onChange={() => setCheckboxValue(!checkboxValue)}/>Remember me
                    </div>
                </label>
            </div>
            <Button onClick={() => handleSignIn()}
                    className="btn-save">Sign in</Button></>
    );
}

export default FormAuthorization;

