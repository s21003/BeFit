import styled from "styled-components";

export const CalendarControlsWrap = styled.div`
    height: 15%;
`;

export const CalendarControls = styled.div`
    margin: auto;
    max-width: 400px;
    text-align: center;
    
    button{
        width: 45%;
        margin: 0 2%;
    }
`;

export const CalendarTableWrap= styled.div`
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
`;

export const CalendarTable = styled.div`
    height: 85%;
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export const CalendarRow = styled.div`
    display: flex;
    flex: 1;
`;

export const CalendarHeading = styled.div`
    display: flex;
    flex-direction: row;
`;

export const CalendarHeadingCell = styled.div`
    flex: 1;
    text-align: center;
`;

export const CalendarCellWrap = styled.div`
    padding: 0px;
    flex: 1;
`;

export const CalendarCell = styled.div.attrs({
    className: 'calendar-cell',
})`
  border: 1px solid #eee;
  position: relative;
  height: 100%;
`;