import React, {} from 'react';
import './style.scss';
import {
    getStringFromDate,
    getDayOfLastMonth, getDayOfMonth,
    getDayOfWeek, getDaysInMonth, getFirstDayOfMonth, getLastDayOfMonth
} from "../../Utils/date";

function Calendar({date, importantDates, clickPrevButton, clickNextButton, classNameCursor, themeName}) {//importantDates = [number,number.....]

    let arrayOfDays = [];//массив с днями для формирования календаря

    let firstDayOfMonth = getDayOfWeek(getFirstDayOfMonth(date));
    let lastDayOfMonth = getDayOfWeek(getLastDayOfMonth(date));

    for (let i = 1; i < firstDayOfMonth; i++) {//добавляем дни предыдущего месяца (бледные)
        let per = getDayOfLastMonth(date, (firstDayOfMonth - i));
        arrayOfDays.push(<li className='dayOfAnotherMonth' key={'dayOfLastMonth' + i}>{per}</li>);
    }

    for (let i = 0; i < getDaysInMonth(date); i++) {//основная часть календаря
        let classWeekend = '';
        const day = getDayOfWeek(getDayOfMonth(date, (i + 1)));
        if (day > 5) {//если это суббота или воскресенье - выделяем их дургим цветом
            classWeekend = "weekend";
        }

        if (importantDates.includes(i + 1)) {//выделение тех дней, где есть важные события
            arrayOfDays.push(<li key={'day' + i}><span className={"active " + classWeekend}>{i + 1}</span>
            </li>);
        } else {
            arrayOfDays.push(<li key={'day' + i}><span className={classWeekend}>{i + 1}</span></li>);
        }
    }

    for (let i = 0; i < (7 - lastDayOfMonth); i++) {//добавляем дни следующего месяца (бледные)
        arrayOfDays.push(<li className='dayOfAnotherMonth' key={'dayOfNextMonth' + i}>{i + 1}</li>);
    }

    return (<div className={`${themeName} calendar ${classNameCursor ? classNameCursor : ''}`}>
        <div className="month">
            <ul>
                <li className="prev" onClick={clickPrevButton}>&#10094;</li>
                <li className="next" onClick={clickNextButton}>&#10095;</li>
                <li className='monthName'>{getStringFromDate(date, 'MMMM')}<br/><span
                    className="spanCalendar">{getStringFromDate(date, 'YYYY')}</span></li>
            </ul>
        </div>
        <ul className="weekdays">
            <li>Mo</li>
            <li>Tu</li>
            <li>We</li>
            <li>Th</li>
            <li>Fr</li>
            <li>Sa</li>
            <li>Su</li>
        </ul>
        <ul className="days">
            {arrayOfDays}
        </ul>
    </div>);
}

export default Calendar;