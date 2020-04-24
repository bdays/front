import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import './style.scss';

import {
    calendarFetchListOfBdays,
    calendarDeleteBday,
    calendarEditBday,
    calendarFetchBday
} from '../../Reducers/birthdays';

import Calendar from "../../components/Calendar";
import Table from "../../components/Table";
import Button from "../../components/Button";
import FormBday from "../../components/FormBday";
import Modal from "../../components/Modal";
import SnackBar from "../../components/SnackBar";
import {dateToUnix, getCurrentDate, getStringFromDate, getLastMonth, getNextMonth} from "../../Utils/date";
import {getCell} from "../../Utils/table";
import {isUserLoggedIn} from "../../Utils/user";
import {buttons, getButton} from "../../Utils/buttons";

function MainPage({themeName}) {
    const {payload, isLoading} = useSelector(state => state.birthdays.list, shallowEqual);
    const dispatch = useDispatch();

    const [dateForCalendar, setDateForCalendar] = useState(getCurrentDate());
    const [showModal, setShowModal] = useState(false);//модалка для редактирования ДР
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [snackBarContent, setSnackBarContent] = useState('');
    const [showSimpleModal, setShowSimpleModal] = useState(false);//уточняющая модалка
    const [currentId, setCurrentId] = useState(null);//айди bday, с которым в данный момент работает пользователь
    const payloadBday = useSelector(state => state.birthdays.bday.payload, shallowEqual);
    const isLoadingBday = useSelector(state => state.birthdays.bday.isLoading, shallowEqual);

    useEffect(() => {
        dispatch(calendarFetchListOfBdays());
        isUserLoggedIn();
    }, [dispatch]);

    const handleEdit = useCallback((id, date) => {
        dispatch(calendarEditBday(id, date)).then((resp) => {
            if (resp.ok) {
                setSnackBarContent('Birthday successfully edit');
            } else {
                setSnackBarContent('Error: ' + resp.statusText);
            }
            setShowSnackBar(true);
            setTimeout(() => setShowSnackBar(false), 3000);

            dispatch(calendarFetchListOfBdays());
        }).catch(() => {
            //обработать возможные ошибки
        })
    }, []);

    const handleDelete = useCallback((id) => {
        dispatch(calendarDeleteBday(id)).then(() => {
            setCurrentId(null);
            setShowSimpleModal(false);
            dispatch(calendarFetchListOfBdays());
        }).catch(() => {
            //обработать возможные ошибки
        })
    }, []);

    const userData = useMemo(() => (payloadBday && !isLoadingBday) ?
        {...payloadBday, id: currentId} : {id: null, firstName: '', lastName: '', data: {}, date: ''}
        , [payloadBday, isLoadingBday, showModal]);

    const listOfBdays = useMemo(() => (payload && !isLoading) ?
        getListOfBdays() : []
        , [payload, currentId, dateForCalendar]);

    const importantDates = useMemo(() => (payload && !isLoading) ?
        getImportantDates() : []
        , [payload, dateForCalendar]);


    function getImportantDates() {
        return payload[getStringFromDate(dateForCalendar, 'MMMM')].map((item) => {
            return item['day'];//формирование массива "важных дат" для календаря
        });
    }

    function getListOfBdays() {
        return payload[getStringFromDate(dateForCalendar, 'MMMM')].map((item, index) => {
            let action = (isUserLoggedIn()) ?
                [
                    getButton(buttons.EDIT, () => {
                        setCurrentId(item.id);
                        dispatch(calendarFetchBday(item.id)).then(() => {
                            setShowModal(true)
                        }).catch(() => {
                        });
                    }, 'ButtonEdit' + index),
                    getButton(buttons.DELETE, () => {
                        setShowSimpleModal(true);
                        setCurrentId(item['id']);
                    }, 'ButtonDelete' + index)
                ] : [];

            return [
                getCell('td-m', item.day),
                getCell('th-l', item.fullName),
                getCell('td-action', action),
            ];
        })
    }


    return <div>
        <Modal
            show={showModal}
            header='Edit birthday'
            content={
                <FormBday edit={true} onSave={(data) => {
                    handleEdit(data.id, {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        data: data.data,
                        date: dateToUnix(data.date),
                    });
                    setShowModal(false);
                }} editData={userData}/>
            }
            toClose={() => setShowModal(false)}
        />
        <Modal show={showSimpleModal} header='Delete'
               content={<>You sure?
                   <Button className='btn-modal-yes'
                           children='No'
                           onClick={() => setShowSimpleModal(false)}/>
                   <Button className='btn-modal-yes' children='Yes'
                           onClick={() => handleDelete(currentId)}/>
               </>}
               toClose={() => setShowSimpleModal(false)}/>
        <SnackBar
            show={showSnackBar}
            content={snackBarContent}
        />
        <Calendar
            themeName={themeName}
            date={dateForCalendar}
            importantDates={importantDates}
            classNameCursor={isLoading ? 'waitCursor' : ''}
            clickPrevButton={() => setDateForCalendar(getLastMonth(dateForCalendar))}
            clickNextButton={() => setDateForCalendar(getNextMonth(dateForCalendar))}/>
        <div className={themeName + ' table-on-main-page'}>
            <div className="div-birthdays month">
                <ul>
                    <li className='monthName'><span
                        className="spanCalendar">Birthdays</span></li>
                </ul>
            </div>
            <Table
                classNameTable=''
                classNameTableHead=''
                header={[]}
                content={listOfBdays}
                isLoading={isLoading}
            /></div>

    </div>;
}

export default MainPage;
