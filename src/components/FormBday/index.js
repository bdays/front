import React, {useState} from 'react';

import './style.scss'

import Button from "../Button";
import Input from "../Input";
import ErrorBlock from "../Error";
import {compareObj} from "../../Utils/objects";
import {dateOfBdayValidation, isValidationSuccessful, nameValidation} from "../../Utils/validation";
import {dateFormat} from "../../Utils/date";

function FormBday({editData, onSave, edit}) {
    const [data, setData] = useState(editData);
    const [err, setErr] = useState({
        show: false,
        firstName: '',
        lastName: '',
        date: '',
    });

    return (
        <>
            <form className='form-addBday'>
                <label>First Name<ErrorBlock content={err.firstName}/>
                    <Input
                        placeholder='Enter first name..'
                        value={data.firstName}
                        handleChange={(e) => {
                            setData({...data, firstName: e.target.value});
                            //setErr(validation({...data, firstName: 'Иван'}));
                        }}/>
                </label>
                <label>Last Name<ErrorBlock content={err.lastName}/>
                    <Input
                        placeholder='Enter last name..'
                        value={data.lastName}
                        handleChange={(e) => {
                            setData({...data, lastName: e.target.value});
                            //setErr(validation({...data, lastName: e.target.value}));
                        }}/>
                </label>
                <label>Date<ErrorBlock content={err.date}/>
                    <Input
                        placeholder={dateFormat}
                        value={data.date}
                        handleChange={(e) => {
                            setData({...data, date: e.target.value});
                            //setErr(validation({...data, date: '01/01/1999'}));
                        }}/>
                </label>
            </form>
            <Button onClick={() => {
                //валидация и только потом закрытие формы и др
                setErr(formBdayValidation(data));
                if (!formBdayValidation(data).show) {
                    onSave(data);
                }

            }}
                    disabled={(compareObj(editData, data) && (edit) && (data.date.length === 0)) ? ('disabled') : ('')}
                    className="btn-save">Save</Button></>
    );
}

export default FormBday;

export function formBdayValidation(data) {
    let err = {
        show: false,
        firstName: '',
        lastName: '',
        date: '',
    };

    err.firstName = nameValidation(data.firstName);
    err.lastName = nameValidation(data.lastName);
    err.date = dateOfBdayValidation(data.date);

    err.show = !isValidationSuccessful(err);
    return err;
}