import * as React from "react";
import Button from "@mui/material/Button";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// @ts-ignore
import { requestReport } from './backendService';
import {BaseSyntheticEvent} from "react";

function Reports() {
    const [startDate, setStartDate] = React.useState<any>();
    const [endDate, setEndDate] = React.useState<any>();

    const handleSubmit = (event: BaseSyntheticEvent) => {
        event.preventDefault();

        requestReport(startDate.toISOString(), endDate.toISOString())
            .then((_res: Promise<any>) => {
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
