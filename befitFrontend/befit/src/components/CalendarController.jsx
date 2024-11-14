import { Calendar } from './Calendar';
import moment from "moment";
import {useState} from "react";

export const CalendarController = () => {
    const today = moment();
    const [currentMonthMoment, setCurrentMonthMoment] = useState(today);

    const incrementMonth = () => {
        setCurrentMonthMoment(moment(currentMonthMoment.add(1, 'months')));
    }

    const decrementMonth = () => {
        setCurrentMonthMoment(moment(currentMonthMoment.subtract(1, 'months')));
    }

    return (
        <Calendar
            month={currentMonthMoment.format('MM')}
            year={currentMonthMoment.format('YYYY')}
            onPrev={decrementMonth}
            onNext={incrementMonth} />
    )
}
export default CalendarController;