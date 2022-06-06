import React from "react";
import {useContext} from "react";
import styled from "styled-components";
import {CalendarContext} from "../CalendarContext";
import {isValidDate} from "../util";

const Days = () => {
    const {date, calendarWidth, dateStyle, dateHoverStyle, dateClickHandler, periodStyle} = useContext(CalendarContext);
    const periodStart = periodStyle.period.periodStart;
    const periodEnd = periodStyle.period.periodEnd;
    const weeks = getWeeks(date.year, date.month);
    return (
        <DateBox>
            {weeks.map((week, weekIdx) => (
                <Week key={weekIdx} weekInd={weekIdx}>
                    {week.map((day, idx) => {
                        const currentDate = {
                            year: date.year,
                            month: date.month,
                            date: day,
                        };
                        return (
                            <DateBackground
                                key={idx}
                                calendarWidth={calendarWidth}
                                isDuringPeriod={isDuringPeriod(periodStart, periodEnd, currentDate)}
                                isPeriodStart={isSameDate(periodStart, currentDate)}
                                isPeriodEnd={isSameDate(periodEnd, currentDate)}
                                periodStyle={periodStyle.style}
                            >
                                <DateContent
                                    data-year={date.year}
                                    data-month={date.month}
                                    data-date={day}
                                    calendarWidth={calendarWidth}
                                    dateStyle={dateStyle}
                                    dateHoverStyle={dateHoverStyle}
                                    onClick={dateClickHandler}
                                    periodStyle={periodStyle.style}
                                    isDuringPeriod={isDuringPeriod(periodStart, periodEnd, currentDate)}
                                >
                                    {day}
                                </DateContent>
                            </DateBackground>
                        );
                    })}
                </Week>
            ))}
        </DateBox>
    );
};

const getWeeks = (year, month) => {
    const WEEK_NUM = 7;
    const weeks = [];
    const firstDay = new Date(Number(year), Number(month) - 1, 1).getDay();
    const lastDate = new Date(Number(year), Number(month), 0).getDate();
    const dates = Array.from({length: lastDate}, (_, ind) => ind + 1);
    weeks.push(dates.slice(0, WEEK_NUM - firstDay));
    for (let idx = WEEK_NUM - firstDay; idx < lastDate; idx += WEEK_NUM) {
        weeks.push(dates.slice(idx, idx + WEEK_NUM));
    }
    return weeks;
};

const isDuringPeriod = (periodStart, periodEnd, today) => {
    try {
        if (isValidDate(periodStart) && isValidDate(periodEnd) && isValidDate(today)) {
            return (
                new Date(periodStart.year, periodStart.month - 1, periodStart.date) <= new Date(today.year, today.month - 1, today.date) &&
                new Date(today.year, today.month - 1, today.date) <= new Date(periodEnd.year, periodEnd.month - 1, periodEnd.date)
            );
        }
        throw new Error();
    } catch (e) {
        console.error("Invalid preiod Date");
        return false;
    }
};

const isSameDate = (date1, date2) => {
    try {
        if (isValidDate(date1) && isValidDate(date2)) {
            return new Date(date1.year, date1.month - 1, date1.date).getTime() === new Date(date2.year, date2.month - 1, date2.date).getTime();
        }
    } catch (e) {
        console.error("Invalid preiod Date");
        return false;
    }
};

const DateBox = styled.div`
    display: flex;
    flex-direction: column;
    height: ${({calendarWidth}) => `${calendarWidth / 14}px`};
    align-items: center;
    width: 100%;
    font-size: ${({calendarWidth}) => `${calendarWidth / 28}px`};
    gap: ${({calendarWidth}) => `${calendarWidth / 84}px`};
`;

const Week = styled.div`
    display: flex;
    width: 100%;
    justify-content: ${({weekInd}) => (weekInd === 0 ? "flex-end" : "flex-start")};
`;

const DateBackground = styled.div`
    width: ${({calendarWidth}) => `${calendarWidth / 7}px`};
    line-height: ${({calendarWidth}) => `${calendarWidth / 7}px`};
    text-align: center;
    font-size: ${({calendarWidth}) => `${calendarWidth / 28}px`};
    ${({isDuringPeriod, periodStyle}) => (isDuringPeriod ? periodStyle : {})}
    ${({isPeriodStart}) => isPeriodStart && {"border-top-left-radius": "50%", "border-bottom-left-radius": "50%"}}
    ${({isPeriodEnd}) => isPeriodEnd && {"border-top-right-radius": "50%", "border-bottom-right-radius": "50%"}}
`;

const DateContent = styled.div`
    border: 1px solid ${({periodStyle, isDuringPeriod}) => (isDuringPeriod ? periodStyle.backgroundColor : "white")};
    border-radius: 50%;
    ${({dateStyle}) => dateStyle}
    &:hover {
        border-radius: 50%;
        ${({dateHoverStyle}) => dateHoverStyle}
    }
`;

export default Days;