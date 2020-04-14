import React, {useState} from 'react';

import './style.scss'

import Button from "../Button";
import Input from "../Input";
import ErrorBlock from "../Error";
import CalendarService from "../../Services/CalendarService";
import {userLogin} from "../../Utils/user";

function FormAuthorization({onSignIn, toClose}) {
    const [data, setData] = useState((localStorage.getItem('userData')) ? JSON.parse(localStorage.getItem('userData')):{
        userName: '',
        password: ''
    });
    const [err, setErr] = useState('');
    const [checkboxValue, setCheckboxValue] = useState(false);

    const handleSignIn = () => {
        CalendarService.logIn(data).then(res => {
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
        })
    }
    return (
        <>
            <form className='form-authorization'>
                <label>Login
                    <Input
                        placeholder='Enter login..'
                        value={data.userName}
                        handleChange={(e) => {
                            setData({...data, userName: e.target.value});
                            setErr('');
                        }}/>
                </label>
                <label>Password
                    <Input
                        placeholder='Enter password..'
                        value={data.password}
                        handleChange={(e) => {
                            setData({...data, password: e.target.value});
                            setErr('');
                        }}/>
                </label>
                <ErrorBlock content={err}/>
                <label>
                    <div className='checkbox'><input type="checkbox" value={checkboxValue}
                                                     onChange={() => setCheckboxValue(!checkboxValue)}/>Remember me
                    </div>
                </label>
            </form>
            <Button onClick={() => handleSignIn()}
                    className="btn-save">Sign in</Button></>
    );
}

export default FormAuthorization;
