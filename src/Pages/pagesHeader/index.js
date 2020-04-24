import React, {useCallback, useState} from 'react';
import {Link, useLocation,} from 'react-router-dom';
import {shallowEqual, useDispatch, useSelector} from "react-redux";

import './style.scss';

import {calendarAddTemplate, calendarFetchListOfTemplates} from "../../Reducers/templates";
import {calendarAddBday, calendarFetchListOfBdays} from "../../Reducers/birthdays";
import {calendarAddUser} from "../../Reducers/users";

import imgBday from '../../image/iconBday.png';
import imgSignIn from '../../image/iconSignIn.png';
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
import FormAddUser from "../../components/FormAddUser";
import FormEditPassword from "../../components/FormEditPassword";
import NavBar from "../../components/NavBar";
import SelectBox from "../../components/SelectBox";

import imgSettings from "../../image/iconSettings.svg";
import {themeNames} from "../../Utils/constants";
import {saveTheme} from "../../Utils/themes";

export default function ({themeName, setThemeName}) {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();

    const {isLoading} = useSelector(state => state.users.add, shallowEqual);

    const [showModalBday, setShowModalBday] = useState(false);
    const [showModalTemplate, setShowModalTemplate] = useState(false);
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [snackBarContent, setSnackBarContent] = useState('');
    const [showModalAuthorization, setShowModalAuthorization] = useState(false);
    const [showModalLogon, setShowModalLogon] = useState(false);
    const [showModalAddUser, setShowModalAddUser] = useState(false);
    const [showModalEditPassword, setShowModalEditPassword] = useState(false);
    const [showSimpleModal, setShowSimpleModal] = useState(false);
    const [contentFromModalEditPassword, setContentFromModalEditPassword] = useState('');
    const [contentFromSimpleModal, setContentFromSimpleModal] = useState('');
    const [showSelectThemeBox, setShowSelectThemeBox] = useState(false);

    function displaySnackBar() {
        setShowSnackBar(true);
        setTimeout(() => setShowSnackBar(false), 3000);
    }

    const handleAddBday = useCallback((data) => {
        dispatch(calendarAddBday(data)).then((resp) => {
            //выводим сообщение
            if (resp.ok) {
                setSnackBarContent('Birthday successfully added');
            } else {
                setSnackBarContent('Error: ' + resp.statusText);
            }
            displaySnackBar();
            dispatch(calendarFetchListOfBdays());

        }).catch((err) => {
            setSnackBarContent('Error: ' + err);
            displaySnackBar();
        })
    }, []);

    const handleAddTemplate = useCallback((data) => {
        dispatch(calendarAddTemplate(data)).then((resp) => {
            if (resp.ok) {
                setSnackBarContent('Template successfully added');
            } else {
                setSnackBarContent('Error: ' + resp.statusText);
            }

            displaySnackBar();
            dispatch(calendarFetchListOfTemplates());

        }).catch((err) => {
            setSnackBarContent('Error: ' + err);
            displaySnackBar();
        })
    }, []);

    const handleAddUser = useCallback((data) => {
        dispatch(calendarAddUser(data)).then((resp) => {
            //выводим сообщение
            if (resp.password) {
                setSnackBarContent('User successfully added');
                setContentFromSimpleModal(<>
                    <p>Password for {resp.userName}: {resp.password}</p>
                    <p>You must replace this password when it is convenient for you.</p>
                    <Button className='btn-modal-yes' children='Ok'
                            onClick={() => setShowSimpleModal(false)}/>
                </>);
                setShowSimpleModal(true);
            } else {
                setSnackBarContent('Error');
            }
            displaySnackBar();
        }).catch((err) => {
            setSnackBarContent('Error: ' + err);
            displaySnackBar();
        })
    }, []);

    function getThemesList() {
        return Object.entries(themeNames).map((item) => {
                return {value: item[1], text: item[0]}
            }
        )
    }

    let header;
    if (isUserLoggedIn()) {
        header = (
            <>
                <li>
                    <Link to="/" className={('/' === location.pathname) ? 'active' : ''}>Main</Link>
                </li>
                <li className="dropdown">
                    <Link to={location.pathname}
                          className={('/show-all-birthday' === location.pathname) ? 'active' : ''}>Birthdays</Link>
                    <div className="dropdown-content">
                        <Link to={location.pathname} onClick={() => setShowModalBday(true)}>Add birthday</Link>
                        <Link to="/show-all-birthday">Show all birthdays</Link>
                        <Link to="/schedule">Schedule</Link>
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
                {(Number(localStorage.getItem('role')) !== 1) ? '' : (
                    <li><Link to={location.pathname} onClick={() => setShowModalAddUser(true)}>Add user</Link></li>)}
                <li className="dropdown right ">
                    <Link to={location.pathname}><img
                        src={imgProfile} alt='login'/></Link>
                    <div className="dropdown-content">
                        <Link to={location.pathname} onClick={() => {
                            setContentFromModalEditPassword('');
                            setShowModalEditPassword(true);
                        }}>Change password</Link>
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
                    <Link to="/" className={('/' === location.pathname) ? 'active' : ''}>Main</Link>
                </li>
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
                                               onSignIn={() => {
                                                   dispatch(calendarFetchListOfBdays());
                                               }}/>}
                   toClose={() => setShowModalAuthorization(false)}/>

            <Modal show={showModalAddUser} header='Add user'
                   content={<FormAddUser toClose={() => setShowModalAddUser(false)}
                                         onSave={(data) => {
                                             handleAddUser(data);
                                             setShowModalAddUser(false);
                                         }}/>}
                   toClose={() => setShowModalAddUser(false)}/>

            <Modal show={showModalEditPassword} header='Edit password'
                   content={<FormEditPassword currentPassword={contentFromModalEditPassword} isLoading={isLoading}
                                              onClose={() => setShowModalEditPassword(false)}
                                              onSave={(data) => console.log(data)}/>}
                   toClose={() => setShowModalEditPassword(false)}/>

            <Modal show={showSimpleModal} header='Password for new user'
                   content={contentFromSimpleModal} toClose={() => setShowSimpleModal(false)}/>

            <Modal show={showModalLogon} header='Logon'
                   content={<>You sure?
                       <Button className='btn-modal-yes'
                               children='No'
                               onClick={() => setShowModalLogon(false)}/>
                       <Button className='btn-modal-yes' children='Yes'
                               onClick={() => {
                                   userLogon();
                                   setShowModalLogon(false);
                                   history.push("/");
                                   dispatch(calendarFetchListOfBdays());
                               }}/>
                   </>}
                   toClose={() => setShowModalLogon(false)}/>

            <SnackBar show={showSnackBar} content={snackBarContent}/>
            <NavBar themeName={themeName} logo={imgBday} children={header}/>

            {(showSelectThemeBox) ? <SelectBox className='selectBox-selectThemes'
                                               children={getThemesList()}
                                               onChange={(value) => {
                                                   setThemeName(value);
                                                   saveTheme(value);
                                               }}
                                               value={themeName}/> : ''
            }

            <Button className='button-img btn-selectThemes'
                    children={<img
                        src={imgSettings} alt='selectTheme' title='Select theme'/>}
                    onClick={() => setShowSelectThemeBox(!showSelectThemeBox)}/>
        </>
    );
}
