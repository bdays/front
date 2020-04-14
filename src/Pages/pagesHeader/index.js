import React, {useCallback, useEffect, useState} from 'react';
import {Link, useLocation,} from 'react-router-dom';
import {useDispatch} from "react-redux";

import './style.scss';

import {calendarAddTemplate, calendarFetchListOfTemplates} from "../../Reducers/templates";
import {calendarAddBday, calendarFetchListOfBdays} from "../../Reducers/birthdays";

import imgBday from '../../image/iconBday.png';
import imgSignIn from '../../image/icon-sign-in.png';
import imgProfile from '../../image/iconProfile.png';
import Modal from "../../components/Modal";
import FormBday from "../../components/FormBday";
import SnackBar from "../../components/SnackBar";
import FormTemplate from "../../components/FormTemplate";
import {dateToUnix} from "../../Utils/date";
import FormAuthorization from "../../components/FormAuthorization";
import {isUserLoggedIn, userLogon} from "../../Utils/user";
import Button from "../../components/Button";
import {useHistory} from "react-router";

export default function () {
    let location = useLocation();
    let history = useHistory();
    const dispatch = useDispatch();

    const [showModalBday, setShowModalBday] = useState(false);
    const [showModalTemplate, setShowModalTemplate] = useState(false);
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [snackBarContent, setSnackBarContent] = useState('');
    const [showModalAuthorization, setShowModalAuthorization] = useState(false);
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [showModalLogon, setShowModalLogon] = useState(false);

    useEffect(() => {
        setUserLoggedIn(isUserLoggedIn());
    }, []);

    const handleAddBday = useCallback((data) => {
        dispatch(calendarAddBday(data)).then((resp) => {
            //выводим сообщение
            if (resp.ok) {
                setSnackBarContent('Birthday successfully added');
            } else {
                setSnackBarContent('Error: ' + resp.statusText);
            }
            setShowSnackBar(true);
            setTimeout(() => setShowSnackBar(false), 3000);
            dispatch(calendarFetchListOfBdays());

        }).catch((err) => {
            setSnackBarContent('Error: ' + err);
            setShowSnackBar(true);
            setTimeout(() => setShowSnackBar(false), 3000);

            //обработать возможные ошибки
        })
    }, []);

    const handleAddTemplate = useCallback((data) => {
        dispatch(calendarAddTemplate(data)).then((resp) => {
            if (resp.ok) {
                setSnackBarContent('Template successfully added');
            } else {
                setSnackBarContent('Error: ' + resp.statusText);
            }

            setShowSnackBar(true);
            setTimeout(() => setShowSnackBar(false), 3000);
            dispatch(calendarFetchListOfTemplates());

        }).catch(() => {
            //console.log('err: '+err);
            //обработать возможные ошибки
        })
    }, []);

    let header;
    if (userLoggedIn) {
        header = (
            <>
                <li className="dropdown">
                    <Link to={location.pathname}
                          className={('/show-all-birthday' === location.pathname) ? 'active' : ''}>Birthdays</Link>
                    <div className="dropdown-content">
                        <Link to={location.pathname} onClick={() => setShowModalBday(true)}>Add birthday</Link>
                        <Link to="/show-all-birthday">Show all birthdays</Link>
                    </div>
                </li>
                <li className="dropdown">
                    <Link to={location.pathname}
                          className={('/show-all-templates' === location.pathname) ? 'active' : ''}>Templates</Link>
                    <div className="dropdown-content">
                        <Link to={location.pathname} onClick={() => setShowModalTemplate(true)}>Add new
                            templates</Link>
                        <Link to="/show-all-templates">Show all templates</Link>
                    </div>
                </li>
                <li className="dropdown right">
                    <Link to={location.pathname} onClick={() => setShowModalAuthorization(true)}><img
                        src={imgProfile} alt='login'/></Link>
                    <div className="dropdown-content">
                        <Link to={location.pathname} onClick={() => console.log('EDIT')}>Edit profile</Link>
                        <Link to={location.pathname} onClick={() => setShowModalLogon(true)}>Logout</Link>
                    </div>
                </li>
                <li className='li-text-login'>
                    <Link to={location.pathname}
                          onClick={() => setShowModalAuthorization(true)}>{localStorage.getItem('userName')}</Link>
                </li>

            </>);
    } else {
        header = (
            <>
                <li>
                    <Link to="/show-all-birthday"
                          className={('/show-all-birthday' === location.pathname) ? 'active' : ''}>Birthdays</Link>
                </li>
                <li className='li-img-login'>
                    <Link to={location.pathname} onClick={() => setShowModalAuthorization(true)}><img
                        src={imgSignIn} alt='login'/></Link>
                </li>
                <li className='li-text-login'>
                    <Link to={location.pathname} onClick={() => setShowModalAuthorization(true)}>LOGIN</Link>
                </li>
            </>);
    }

    return (
        <>
            <Modal show={showModalBday} header='Add birthday'
                   content={<FormBday editData={{firstName: '', lastName: '', data: {}, date: ''}} onSave=
                       {(data) => {
                           handleAddBday({...data, date: dateToUnix(data.date)});
                           setShowModalBday(false);
                       }}
                   />} toClose={() => setShowModalBday(false)}/>

            <Modal show={showModalTemplate} header='Add template'
                   content={<FormTemplate editData={{title: '', text: '', blocks: [], attachments: []}} onSave=
                       {(data) => {
                           handleAddTemplate(data);
                           setShowModalTemplate(false);
                       }}
                   />} toClose={() => setShowModalTemplate(false)}/>

            <Modal show={showModalAuthorization} header='Authorization'
                   content={<FormAuthorization toClose={() => setShowModalAuthorization(false)}
                                               onSignIn={() => setUserLoggedIn(isUserLoggedIn())}/>}
                   toClose={() => setShowModalAuthorization(false)}/>
            <Modal show={showModalLogon} header='Logon'
                   content={<>You sure?
                       <Button className='btn-modal-yes'
                               children='No'
                               onClick={() => setShowModalLogon(false)}/>
                       <Button className='btn-modal-yes' children='Yes'
                               onClick={() => {
                                   userLogon();
                                   setUserLoggedIn(isUserLoggedIn());
                                   setShowModalLogon(false);
                                   history.push("/");
                               }}/>
                   </>}
                   toClose={() => setShowModalLogon(false)}/>
            <SnackBar show={showSnackBar} content={snackBarContent}/>

            <div className='router'>
                <ul>
                    <li>
                        <img className='icon-bDay' src={imgBday} alt='Bday'/>
                    </li>
                    <li>
                        <Link to="/" className={('/' === location.pathname) ? 'active' : ''}>Main</Link>
                    </li>
                    {header}

                </ul>
            </div>

        </>
    );
}
