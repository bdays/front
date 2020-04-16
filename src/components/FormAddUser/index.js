import React, {useState} from 'react';
import './style.scss'

import Button from "../Button";
import Input from "../Input";
import ErrorBlock from "../Error";
import SelectBox from "../SelectBox";
import {
    isValidationSuccessful,
    userNameValidation
} from "../../Utils/validation";


function FormAddUser({onSave}) {

    const [data, setData] = useState({
        userName: '',
        role: 2,
    });
    const [err, setErr] = useState(defaultErr);


    return (
        <>
            <form className='form-authorization'>
                <label>User name<ErrorBlock content={err.userName}/>
                    <Input
                        placeholder='Enter user name..'
                        value={data.userName}
                        handleChange={(e) => {
                            setData({...data, userName: e.target.value});
                        }}/>
                </label>

                <label>Role
                    <SelectBox children={[
                        {value: 1, text: 'Administrator'},
                        {value: 2, text: 'Simple User'},
                    ]}
                               onChange={(value) => setData({...data, role: Number(value)})} value={data.role}/>
                </label>

            </form>
            <Button onClick={() => {
                setErr(formAddUserValidation(data));
                if (!formAddUserValidation(data).show) {
                    onSave(data);
                }
            }}
                    className="btn-save">Next</Button></>
    );
}

export default FormAddUser;

const defaultErr = {
    show: false,
    userName: '',
};

export function formAddUserValidation(data) {
    let err = {...defaultErr};

    err.userName = userNameValidation(data.userName);

    err.show = !isValidationSuccessful(err);
    return err;
}