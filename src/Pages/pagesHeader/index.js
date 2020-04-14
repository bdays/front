import React, {useCallback, useState} from 'react';
import {Link, useLocation,} from 'react-router-dom';
import {useDispatch} from "react-redux";

import './style.scss';

import {calendarAddTemplate, calendarFetchListOfTemplates} from "../../Reducers/templates";
import {calendarAddBday, calendarFetchListOfBdays} from "../../Reducers/birthdays";
import CalendarService from "../../Services/CalendarService";

import imgBday from '../../image/iconBday.png';
import imgSignIn from '../../image/icon-sign-in.png';
import Modal from "../../components/Modal";
import FormBday from "../../components/FormBday";
import SnackBar from "../../components/SnackBar";
import FormTemplate from "../../components/FormTemplate";
import {dateToUnix} from "../../Utils/date";
import FormAuthorization from "../../components/FormAuthorization";

export default function () {
    let location = useLocation();
    const dispatch = useDispatch();

    const [showModalBday, setShowModalBday] = useState(false);
    const [showModalTemplate, setShowModalTemplate] = useState(false);
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [snackBarContent, setSnackBarContent] = useState('');
    const [showModalAuthorization, setShowModalAuthorization] = useState(false);

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
                   content={<FormAuthorization onContinueAsGuest={() => console.log('continue')}
                                               onSignIn={(data) => CalendarService.logIn(data).then(res => {
                                                   if (res.data) {
                                                       saveToken(res.data.token);
                                                       setShowModalAuthorization(false);
                                                   }
                                               })} toClose={() => setShowModalAuthorization(false)}/>}
                   toClose={() => setShowModalAuthorization(false)}/>

            <SnackBar show={showSnackBar} content={snackBarContent}/>

            <div className='router'>
                <ul>
                    <li>
                        <img className='icon-bDay' src={imgBday} alt='Bday'/>
                    </li>
                    <li>
                        <Link to="/" className={('/' === location.pathname) ? 'active' : ''}>Main</Link>
                    </li>
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
                    <li className='li-img-login'>
                        <Link to={location.pathname} onClick={() => setShowModalAuthorization(true)}><img
                            src={imgSignIn} alt='login'/></Link>
                    </li>
                    <li className='li-text-login'>
                        <Link to={location.pathname} onClick={() => setShowModalAuthorization(true)}>LOGIN</Link>
                    </li>
                </ul>
            </div>

        </>
    );
}

function saveToken(token) {
    console.log(token);
}