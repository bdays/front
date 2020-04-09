import React, {useEffect, useMemo, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";

import './style.scss';

import {calendarFetchListOfBdays} from "../../Reducers/calendar";

import Table from "../Table";
import Button from "../Button";

function ListOfBdays({onClickGo}) {
    const dispatch = useDispatch();
    const {payload, isLoading} = useSelector(state => state.calendar.list, shallowEqual);
    const [currentId, setCurrentId] = useState(null);//айди bday, с которым в данный момент работает пользователь

    useEffect(() => {
        dispatch(calendarFetchListOfBdays());
    }, [dispatch]);

    const preparedData = useMemo(() => (payload && !isLoading) ?
            Object.values(payload).flatMap((items) =>
                items.map(({id, fullName}) => ([{
                    name: 'name',
                    children: fullName,
                    className: (currentId === id) ? 'th-l selectedUser' : 'th-l',
                    onClickRow: () => {
                        setCurrentId(id);
                    },
                },]))
            )
            : []
    , [payload, currentId]);

    return (
        <div className='div-tableOfBdays'>
            {currentId ? (
                <Button className='button-go' children='Go >>' onClick={() => onClickGo(currentId)}/>) : (<></>)}
            <p className='p-selectUser'>Select user:</p>
            <Table
                classNameTable='' classNameTableHead=''
                header={[]} content={preparedData}
                isLoading={isLoading}/></div>
    );
}

export default ListOfBdays;
