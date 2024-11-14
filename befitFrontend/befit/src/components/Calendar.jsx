import moment from "moment";
import {CalendarControlsWrap, CalendarControls, CalendarTableWrap, CalendarTable, CalendarRow, CalendarHeading, CalendarHeadingCell, CalendarCellWrap, CalendarCell} from "./StyledComponents"
import {getDaysInMonth, segmentIntoWeeks, daysOfTheWeek, padWeekFront, padWeekBack} from "./CalendarUtil";
import "../styles/Calendar.css"




export const Calendar = ({ month, year, onPrev, onNext}) => {
    const currentMonthMoment = moment(`${month}${year}`,'MMYYYY');

    const weeks = segmentIntoWeeks(getDaysInMonth(currentMonthMoment));

    return(
        <>
            <CalendarTableWrap>
                <CalendarControlsWrap>
                    <CalendarControls>
                        <h1>{currentMonthMoment.format('MMMM YYYY')}</h1>
                        <button onClick={onPrev}>Previous</button>
                        <button onClick={onNext}>Next</button>
                    </CalendarControls>
                </CalendarControlsWrap>

                <CalendarTable>
                    <CalendarHeading>
                    {daysOfTheWeek.map(day => <CalendarHeadingCell key={day}>{day}</CalendarHeadingCell>)}
                    </CalendarHeading>
                    {weeks.map((week, i) => {
                        const displayWeek = i === 0
                            ? padWeekFront(week)
                            : i === weeks.length - 1
                                ? padWeekBack(week)
                                : week;

                        return (
                            <CalendarRow key={i}>
                                {displayWeek.map((dayMoment, j) => (
                                    <CalendarCellWrap>
                                        {dayMoment
                                        ? <CalendarCell key={dayMoment.format('D')}>{dayMoment.format('D')}</CalendarCell>
                                        : <CalendarCell key={`${i}${j}`}></CalendarCell>}
                                    </CalendarCellWrap>
                                    ))}
                            </CalendarRow>
                        );
                    })}
                </CalendarTable>
            </CalendarTableWrap>
        </>
    );
}
export default Calendar;
