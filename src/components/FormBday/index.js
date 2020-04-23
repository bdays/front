import React, {useEffect, useMemo, useState} from 'react';

import './style.scss'

import Button from "../Button";
import Input from "../Input";
import ErrorBlock from "../Error";
import {compareObj} from "../../Utils/objects";
import {dateOfBdayValidation, isValidationSuccessful, nameValidation} from "../../Utils/validation";
import {dateFormat} from "../../Utils/date";
import SelectBox from "../SelectBox";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {calendarFetchListOfTemplates} from "../../Reducers/templates";
import {calendarFetchListOfChannels, calendarSendTestMessage} from "../../Reducers/slack";
import Spinner from "../Spinners";
import ButtonHelp from "../ButtonHelp";
import SnackBar from "../SnackBar";

function FormBday({editData, onSave, edit}) {
    const dispatch = useDispatch();

    const payloadTemplate = useSelector(state => state.templates.list.payload, shallowEqual);
    const isLoadingTemplate = useSelector(state => state.templates.list.isLoading, shallowEqual);
    const payloadChannel = useSelector(state => state.slack.listOfChannels.payload, shallowEqual);
    const isLoadingChannel = useSelector(state => state.slack.listOfChannels.isLoading, shallowEqual);

    const [snackBarContent, setSnackBarContent] = useState('');
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [data, setData] = useState(editData);
    const [err, setErr] = useState({
        show: false,
        firstName: '',
        lastName: '',
        date: '',
    });

    useEffect(() => {
        dispatch(calendarFetchListOfTemplates());
        dispatch(calendarFetchListOfChannels());
    }, [dispatch]);

    useEffect(() => {
        window.addEventListener("keydown", escFunction, {once: true, capture: false});
        return () => {
            window.removeEventListener("keydown", escFunction, {once: true, capture: false});
        };
    });

    function escFunction(e) {
        if (e.keyCode === 13) {
            handleSave();
        }
    }

    function handleSave() {
        //валидация и только потом закрытие формы и др
        setErr(formBdayValidation(data));
        if (!formBdayValidation(data).show) {
            onSave({...data, data: deleteEmptyProp(data.data)});
        }
    }

    function displaySnackBar() {
        setShowSnackBar(true);
        setTimeout(() => setShowSnackBar(false), 4000);
    }

    const contentOfSelectBoxOfTemplate = useMemo(() => (payloadTemplate && !isLoadingTemplate) ?
        getTemplateList() : getEmptySelectBox()
        , [payloadTemplate, isLoadingTemplate]);

    function getTemplateList() {
        return getEmptySelectBox().concat(payloadTemplate.map((item) => (
            {value: item.id, text: item.title}
        )))
    }

    const contentOfSelectBoxOfChannels = useMemo(() => (payloadChannel && !isLoadingChannel) ?
        getChannelsList() : getEmptySelectBox()
        , [payloadChannel, isLoadingChannel]);

    function getChannelsList() {
        return getEmptySelectBox().concat(payloadChannel.map((item) => (
            {value: item.id, text: item.name}
        )))
    }

    function getEmptySelectBox() {
        return [{value: 0, text: '-- nothing selected --'}]
    }

    return (isLoadingChannel || isLoadingTemplate) ? (<Spinner className='loader1'/>) : (
        <>
            <SnackBar show={showSnackBar} content={snackBarContent}/>
            <div className='form-addBday'>
                <label>First Name<ErrorBlock content={err.firstName}/>
                    <Input
                        placeholder='Enter first name..'
                        value={data.firstName}
                        handleChange={(e) => {
                            setData({...data, firstName: e.target.value});
                        }}/>
                </label>
                <label>Last Name<ErrorBlock content={err.lastName}/>
                    <Input
                        placeholder='Enter last name..'
                        value={data.lastName}
                        handleChange={(e) => {
                            setData({...data, lastName: e.target.value});
                        }}/>
                </label>
                <label>Date<ErrorBlock content={err.date}/>
                    <Input
                        placeholder={dateFormat}
                        value={data.date}
                        handleChange={(e) => {
                            setData({...data, date: e.target.value});
                        }}/>
                </label>
                <label>Choose a template
                    <SelectBox children={contentOfSelectBoxOfTemplate}
                               onChange={(value) => {
                                   setData({...data, data: {...data.data, templateId: value}});
                               }}
                               value={(data.data.templateId) ? data.data.templateId : 0}/>
                </label>
                <ButtonHelp onClick={() => {
                    dispatch(calendarSendTestMessage({"channelId": data.data.targetChannelId})).then(res => {
                        if (res.err) {
                            setSnackBarContent('Cannot send messages to this channel');
                        } else {
                            setSnackBarContent('Success');
                        }
                        displaySnackBar();
                    });
                }} children='Send test message'
                            tooltipText='Send test message into the selected channel'
                            disabled={!(data.data.targetChannelId) || (data.data.targetChannelId === '0')}
                />
                <label>Choose a channel
                    <SelectBox children={contentOfSelectBoxOfChannels}
                               onChange={(value) => {
                                   setData({...data, data: {...data.data, targetChannelId: value}});
                               }}
                               value={(data.data.targetChannelId) ? data.data.targetChannelId : 0}/>

                </label>
            </div>
            <Button onClick={handleSave}
                    disabled={(compareObj(editData, data) && (edit)) ? ('disabled') : ('')}
                    className="btn-save">Save</Button></>
    );
}

export default FormBday;

function deleteEmptyProp(data) {
    for (let item in data) {
        if (Number(data[item]) === 0) {
            delete data[item];
        }
    }
    return data;
}

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