import React, {useCallback, useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import './style.scss';

import {calendarFetchListOfBdays, calendarDeleteBday, calendarEditBday} from '../../Reducers/calendar';

import Calendar from "../../components/Calendar";
import Table from "../../components/Table";
import Button from "../../components/Button";
import FormBday from "../../components/FormBday";
import Modal from "../../components/Modal";
import SnackBar from "../../components/SnackBar";
import {dateToUnix, getCurrentDate, getDate, getLastMonth, getNextMonth} from "../../Utils/date";

function MainPage() {
    const {payload,isLoading} = useSelector(state => state.calendar.list, shallowEqual);
    const dispatch = useDispatch();

    const [dateForCalendar, setDateForCalendar] = useState(getCurrentDate());
    const [showModal, setShowModal] = useState(false);//модалка для редактирования ДР
    const [editData, setEditData] = useState({id: null, firstName: '', lastName: '', data: {}, date: ''});//редактируемые данные, которые отобажаются в модалке
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [snackBarContent, setSnackBarContent] = useState('');
    const [showSimpleModal, setShowSimpleModal] = useState(false);//уточняющая модалка
    const [currentId, setCurrentId] = useState(null);//айди bday, с которым в данный момент работает пользователь

    useEffect(() => {
        dispatch(calendarFetchListOfBdays());
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

    //формирование массива "важных дат" для календаря
    let importantDates;
    try {
        importantDates = payload[getDate(dateForCalendar,'MMMM')].map((item) => {
            return item['day'];
        });

        if (!isLoading) {
            tablePattern.content = [];
            //выводим дни рождения только того месяца, который отображен на календаре
            payload[getDate(dateForCalendar,'MMMM')].forEach((subItem, subIndex) => {
                let action = [<Button key={'ButtonEdit' + subIndex} children='Edit' className="btnEdit"
                                      onClick={() => {
                                          setShowModal(true);
                                          setEditData({
                                              id: subItem.id,
                                              firstName: subItem.firstName,
                                              lastName: subItem.lastName,
                                              data: {},
                                              date: ''
                                          })
                                      }}/>,
                    <Button key={'ButtonDelete' + subIndex} children='Delete' className="btn-delete"
                            onClick={() => {
                                setShowSimpleModal(true);
                                setCurrentId(subItem['id']);
                            }}/>];

                tablePattern.content.push([
                    {
                        name: 'date', className: 'td-m',
                        children: subItem.day,
                    },
                    {
                        name: 'name',
                        children: subItem.fullName,
                        className: 'th-l',
                    },
                    {
                        name: 'action',
                        className: 'td-action',
                        children: action,
                    }
                ])
            });

        }
    } catch (e) {
        importantDates = [];
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
                }} editData={editData}/>
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
        <Calendar date={dateForCalendar}
                  importantDates={importantDates}
                  classNameCursor={isLoading ? 'waitCursor' : ''}
                  clickPrevButton={() => setDateForCalendar(getLastMonth(dateForCalendar))}
                  clickNextButton={() => setDateForCalendar(getNextMonth(dateForCalendar))}/>
        <br/>
        <Table
            classNameTable={tablePattern.classNameTable}
            classNameTableHead={tablePattern.classNameTableHead}
            header={tablePattern.header}
            content={tablePattern.content}
            isLoading={isLoading}
        />

    </div>;
}

export default MainPage;

let tablePattern = {
    classNameTable: '',
    classNameTableHead: '',
    header: [
        {name: 'date', alias: 'Day', className: 'td-sm'},
        {name: 'fullName', alias: 'Name', className: 'td-l'},
        {name: 'action', alias: '', className: 'td-action'},],
    content: []
};
