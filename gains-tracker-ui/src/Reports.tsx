import * as React from "react";
import Button from "@mui/material/Button";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { requestReport } from './backendService';

function Reports() {
    const [startDate, setStartDate] = React.useState();
    const [endDate, setEndDate] = React.useState();

    const handleSubmit = (event) => {
        event.preventDefault();

        requestReport(startDate.toISOString(), endDate.toISOString())
            .then((res) => {
                alert("Report submitted.");
            });
    }

    return (
        <>
            <p>Request a report.</p>
            <form onSubmit={handleSubmit}>
                <DatePicker
                    label="Start Date"
                    onChange={(date) => setStartDate(date)}
                />
                <DatePicker
                    label="End Date"
                    onChange={(date) => setEndDate(date)}
                />
                <Button
                    type="submit"
                >
                    Submit
                </Button>
            </form>
        </>
    )
}

export default Reports
