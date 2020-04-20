import React, {useEffect, useMemo} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import './style.scss';

import {calendarFetchSchedule} from "../../Reducers/birthdays";
import Table from "../../components/Table";
import {getCell} from "../../Utils/table";
import {dateFormat, getStringFromDate, unixToDate} from "../../Utils/date";

function SchedulePage() {
    const dispatch = useDispatch();

    const {payload, isLoading} = useSelector(state => state.birthdays.schedule, shallowEqual);

    useEffect(() => {
        dispatch(calendarFetchSchedule());
    }, [dispatch]);

    const table = useMemo(() => {
            return (payload && !isLoading) ?
                getTable(payload)
                : (<Table key='tableSchedule'
                          header={[]}
                          content={[]}
                          isLoading={true}/>)
        }
        , [payload]);

    function getTable(payload) {
        let tableContent = [];
            payload.forEach((subItem) => {
                const classNameCell='td-m ';
                tableContent.push([
                    getCell(classNameCell, subItem.firstName+' '+subItem.lastName, null),
                    getCell(classNameCell+((subItem.isSetTemplateId)?'':'attention'), (subItem.isSetTemplateId)?'+':'-', null),
                    getCell(classNameCell+((subItem.isSetTargetChannelId)?'':'attention'), (subItem.isSetTargetChannelId)?'+':'-', null),
                    getCell(classNameCell+((subItem.isCongratulate)?'':'attention'), (subItem.isCongratulate)?'+':'-', null),
                    getCell(classNameCell, getStringFromDate(unixToDate(subItem.date),dateFormat), null),
                    getCell(classNameCell, getStringFromDate(unixToDate(subItem.updatedAt),dateFormat), null),
                ]);
            });

        return (<Table key='tableSchedule'
                       classNameTable='table-schedule'
                       header={header} content={tableContent}
                       isLoading={isLoading}/>);
    }

    return (<div>
        <div>{table}</div>
    </div>);
}

export default SchedulePage;

const header = [{alias: 'Name'},
    {alias: 'Template'},
    {alias: 'Target Channel'},
    {alias: 'Congratulated'},
    {alias: 'Birthday'},
    {alias: 'Updated at'},
];