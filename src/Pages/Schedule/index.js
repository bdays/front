import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';

import './style.scss';

import {calendarFetchSchedule} from "../../Reducers/birthdays";

function SchedulePage() {
    const dispatch = useDispatch();

    const {payload, isLoading} = useSelector(state => state.birthdays.schedule, shallowEqual);

    useEffect(() => {
        dispatch(calendarFetchSchedule());
    }, [dispatch]);

    console.log(payload);

    return (<div>Schedule</div>);
}

export default SchedulePage;

