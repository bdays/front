import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import './style.scss';

import {calendarDeleteBday, calendarFetchListOfBdays, calendarEditBday} from '../../Reducers/calendar';

import Table from "../../components/Table";
import Button from "../../components/Button";
import FormBday from "../../components/FormBday";
import Modal from "../../components/Modal";
import SnackBar from "../../components/SnackBar";
import {dateToUnix} from "../../Utils/date";
import {getCell} from "../../Utils/table";

function ShowAllBdayPage() {
    const {payload, isLoading} = useSelector(state => state.calendar.list, shallowEqual);
    const dispatch = useDispatch();

    const [editData, setEditData] = useState({id: null, firstName: '', lastName: '', data: {}, date: ''});//редактируемые данные, которые отобажаются в модалке
    const [showModal, setShowModal] = useState(false);//модалка для редактирования ДР
    const [viewMode, setViewMode] = useState(false);//активаця режима просмотра
    const [showSimpleModal, setShowSimpleModal] = useState(false);//уточняющая модалка
    const [currentId, setCurrentId] = useState(null);//айди ДР, с которым в данный момент работает пользователь
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [snackBarContent, setSnackBarContent] = useState('');

    useEffect(() => {
        dispatch(calendarFetchListOfBdays());
    }, [dispatch]);

    const handleDelete = useCallback((id) => {
        dispatch(calendarDeleteBday(id)).then(() => {
            setCurrentId(null);
            setShowSimpleModal(false);
            dispatch(calendarFetchListOfBdays());
        }).catch(() => {
            //обработать возможные ошибки
        })
    }, []);

    const handleEdit = useCallback((id, date) => {
        dispatch(calendarEditBday(id, date)).then((resp) => {
            //выводим сообщение
            if (resp.ok) {
                setSnackBarContent('Birthday successfully edit');
            } else {
                setSnackBarContent('Error: ' + resp.statusText);
            }
            setShowSnackBar(true);
            setTimeout(() => setShowSnackBar(false), 3000);

            dispatch(calendarFetchListOfBdays());
        }).catch(() => {
            //обработать ошибки
        })
    }, []);

    const table = useMemo(() => {
            return (payload && !isLoading) ?
                ((viewMode)?getTableForViewMode(payload):getDefaultTable(payload))
                : (<Table key='mainTable'
                          header={[]}
                          content={[]}
                          isLoading={true}/>)}
        , [payload,viewMode]);

    function getDefaultTable(payload) {
        let tableContent = [];
        for (const item in payload) {
            if (payload[item].length > 0) {//пишем название месяца только если там есть ДР
                tableContent.push([
                    getCell('heading', item, 3),
                ]);
            }
            payload[item].forEach((subItem, subIndex) => {
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
                                setCurrentId(subItem.id);
                                setShowSimpleModal(true);
                            }}/>];

                tableContent.push([
                    getCell('td-m', subItem.day, null),
                    getCell('th-l', subItem.fullName, null),
                    getCell('td-action', action, null),
                ]);
            });
        }
        return (<Table key='mainTable'
                          header={[]} content={tableContent}
                          isLoading={isLoading}/>);
    }

    function getTableForViewMode(payload) {
        const maxBdaysInMonth = getMaxBdaysInMonth(payload);
        let table = [];
        let per = 0;

        for (const item in payload) {
            let tableContent = [];
            tableContent.push([getCell('heading', item, 2)]);

            for (let i = 0; i < maxBdaysInMonth[~~(per / 3)]; i++) {

                tableContent.push([
                    getCell('td-m', (payload[item][i]) ? payload[item][i].day : '\u00A0', null),
                    getCell('td-l', (payload[item][i]) ? payload[item][i].fullName : '\u00A0', null),
                ]);
            }
            table.push(<Table key={'table' + item}
                              classNameTable='table-viewMode'
                              classNameBlock='div-forViewMode'
                              classNameTableHead='heading'
                              header={[]} content={tableContent}
                              isLoading={false}/>);
            per++;
        }
        return table;
    }

    return <div>
        <Modal show={showSimpleModal} header='Delete'
               content={<>You sure?
                   <Button className='btn-modal-yes'
                           children='No'
                           onClick={() => setShowSimpleModal(false)}/>
                   <Button className='btn-modal-yes' children='Yes'
                           onClick={() => handleDelete(currentId)}/>
               </>}
               toClose={() => setShowSimpleModal(false)}/>
        <Modal show={showModal} header='Edit birthday'
               content={<FormBday edit={true} onSave={(data) => {
                   handleEdit(data.id, {
                       firstName: data.firstName,
                       lastName: data.lastName,
                       data: data.data,
                       date: dateToUnix(data.date),
                   });
                   setShowModal(false);
               }} editData={editData}/>}
               toClose={() => setShowModal(false)}/>
        <SnackBar show={showSnackBar} content={snackBarContent}/>
        <br/>
        <Button className='btn-viewMode' children='view mode' onClick={() => setViewMode(!viewMode)}/><br/>
        <br/>
        <div>{table}</div>
    </div>;
}

export default ShowAllBdayPage;

function getMaxBdaysInMonth(payload) {
    //возвращается [a,b,c,d], где абсд - максимальные кол-ва др
    // в группе месяцев (для рисования одинаковых таблиц)
    let array = [1, 1, 1, 1];
    let per = 0;
    for (const item in payload) {
        // ~~ - это сокращенный Math.floor()
        // (~~(per/3)) - разбиваем месяцы на группы по три (остаток от деления на 3 округленный до целого)
        array[~~(per / 3)] = (array[~~(per / 3)] < payload[item].length) ? payload[item].length : array[~~(per / 3)];
        per++;
    }
    return array;
}
