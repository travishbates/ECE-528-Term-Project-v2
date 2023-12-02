import {TableContainer} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import * as React from "react";
import {BaseSyntheticEvent, useEffect} from "react";
import Button from "@mui/material/Button";
// @ts-ignore
import { getReport, getReports } from "./backendService";
import TablePagination from "@mui/material/TablePagination";
// @ts-ignore
import { requestReport } from './backendService';
import {DatePicker} from "@mui/x-date-pickers";
import Grid from "@mui/material/Grid";

const TransactionTable: React.FC = () => {
    const [reports, setReports] = React.useState([]);
    const [count, setCount] = React.useState(0);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [startDate, setStartDate] = React.useState<any>();
    const [endDate, setEndDate] = React.useState<any>();

    useEffect(() => {
        refreshReports();
    }, [page, rowsPerPage]);

    function handleDownload(reportId: any) {
        getReport(reportId);
    }

    const handlePageChange = (_event: any, page: any) => {
        setPage(page);
    }

    const handleRowsPerPageChange = (event: any) => {
        setRowsPerPage(event.target.value);
        setPage(0);
    }

    function refreshReports() {
        getReports(page, rowsPerPage)
            .then((result: any) => {
                setReports(result.results);
                setCount(result.count);
                setPage(result.page);
                setRowsPerPage(result.pageSize);
            });
    }

    const handleSubmit = (event: BaseSyntheticEvent) => {
        event.preventDefault();

        requestReport(startDate.toISOString(), endDate.toISOString())
            .then((_res: Promise<any>) => {
                alert("Report submitted.");
                refreshReports();
            });
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Grid container direction={"row"} spacing={2}>
                    <Grid item>
                        <DatePicker
                            label="Start Date"
                            onChange={(date) => setStartDate(date)}
                        />
                    </Grid>
                    <Grid item>
                        <DatePicker
                            label="End Date"
                            onChange={(date) => setEndDate(date)}
                        />
                    </Grid>
                    <Grid item>

                        <Button
                            type="submit"
                            variant="contained"
                        >
                            Request report
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <h2>Report History</h2>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Status</TableCell>
                            <TableCell>Requested Date</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Download Link</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reports.map((report: any) => (
                            <TableRow key={report.id}>
                                <TableCell>{report.status}</TableCell>
                                <TableCell>{report.requested_date}</TableCell>
                                <TableCell>{report.start_date}</TableCell>
                                <TableCell>{report.end_date}</TableCell>
                                <TableCell>
                                    {
                                        report.status === 'complete' &&
                                        <Button color="inherit" onClick={() => handleDownload(report.id)} variant="contained">Download</Button>
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                count={count}
                page={page}
                onPageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleRowsPerPageChange}
            />
        </>
    )
}

export default TransactionTable
