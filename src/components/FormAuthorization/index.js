import React, {useState} from 'react';

import './style.scss'

import Button from "../Button";
import Input from "../Input";
import ErrorBlock from "../Error";
import CalendarService from "../../Services/CalendarService";

function FormAuthorization({onSignIn, onContinueAsGuest, toClose}) {
    const [data, setData] = useState({
        userName: '',
        password: ''
    });
    const [err, setErr] = useState({
        show: false,
        userName: '',
        password: '',
    });
    const handleSignIn = () => {
        CalendarService.logIn(data).then(res => {
            if (res.data) {
                saveToken(res.data.token);
                toClose();
            }
        })
    }
    return (
        <>
            <form className='form-authorization'>
                <label>Login<ErrorBlock content={err.userName}/>
                    <Input
                        placeholder='Enter login..'
                        value={data.userName}
                        handleChange={(e) => {
                            setData({...data, userName: e.target.value});
                        }}/>
                </label>
                <label>Password<ErrorBlock content={err.password}/>
                    <Input
                        placeholder='Enter login..'
                        value={data.password}
                        handleChange={(e) => {
                            setData({...data, password: e.target.value});
                        }}/>
                </label>
            </form>
            <Button onClick={onContinueAsGuest}
                    className="btn-continue">Continue as guest</Button>
            <Button onClick={() => handleSignIn()}
                //onClick={() => onSignIn(data)}
                    className="btn-save">Sign in</Button></>
    );
}

export default FormAuthorization;

function saveToken(token) {
    localStorage.setItem('token', token);
    console.log(token);
}