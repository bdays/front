import React, {useState} from 'react';

import './style.scss'

import Button from "../Button";
import Input from "../Input";
import ErrorBlock from "../Error";
import {
    isValidationSuccessful,
    passwordValidation,
} from "../../Utils/validation";
import Spinner from "../Spinners";

function FormEditPassword({onSave,onClose, currentPassword, isLoading}) {
    const [data, setData] = useState({
        currentPassword: currentPassword,
        password: '',
    });
    const [err, setErr] = useState(defaultErr);

    return (isLoading)?(<Spinner className='loader1'/>):(
        <>
            <form className='form-authorization'>

                <label>Current password<ErrorBlock content={err.currentPassword}/>
                    <Input
                        placeholder='Enter current password..'
                        value={data.currentPassword}
                        handleChange={(e) => {
                            setData({...data, currentPassword: e.target.value});
                        }}/>
                </label>
                <label>New password<ErrorBlock content={err.password}/>
                    <Input
                        placeholder='Enter new password..'
                        value={data.password}
                        handleChange={(e) => {
                            setData({...data, password: e.target.value});
                        }}/>
                </label>
            </form>
            <Button onClick={() => {
                setErr(formChangePasswordValidation(data));
                if (!formChangePasswordValidation(data).show) {
                    onSave(data);
                }
            }}
                    className="btn-save">Change</Button>
            <Button onClick={onClose}
                    className="btn-save">Continue unchanged</Button></>
    );
}

export default FormEditPassword;

const defaultErr = {
    show: false,
    currentPassword: '',
    password: '',
};

export function formChangePasswordValidation(data) {
    let err = {...defaultErr};

    err.password = passwordValidation(data.password);
    err.currentPassword = passwordValidation(data.currentPassword);

    err.show = !isValidationSuccessful(err);
    return err;
}