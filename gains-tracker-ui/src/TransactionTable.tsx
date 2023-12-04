import {TableContainer} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import * as React from "react";
import { useEffect } from "react";
import Button from "@mui/material/Button";
// @ts-ignore
import { deleteTransaction, getTransactions } from "./backendService";
import TablePagination from "@mui/material/TablePagination";
import TransactionUpload from "./TransactionUpload";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

const TransactionTable: React.FC = () => {
    const [transactions, setTransactions] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [count, setCount] = React.useState(0);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    useEffect(() => {
        refreshTransactions();
    }, [page, rowsPerPage]);

    function handleDeleteTransaction(transactionId: any) {
        deleteTransaction(transactionId)
            .then(() => {
                refreshTransactions();
            });
    }

    const handlePageChange = (_event: any, page: any) => {
        setPage(page);
    }

    const handleRowsPerPageChange = (event: any) => {
        setRowsPerPage(event.target.value);
        setPage(0);
    }

    function refreshTransactions() {
        setLoading(true);
        getTransactions(page, rowsPerPage)
            .then((result: any) => {
                setTransactions(result.results);
                setCount(result.count);
                setPage(result.page);
                setRowsPerPage(result.pageSize);
                setLoading(false);
            });
    }

    return (
        <>
            <TransactionUpload refreshTransactions={refreshTransactions}></TransactionUpload>
            <h2>Transactions</h2>

            { loading ?
                <Grid container direction={"column"} align="center">
                    <Grid item>
                        <CircularProgress />
                    </Grid>
                </Grid> :
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Time</TableCell>
                                    <TableCell>Transaction Type</TableCell>
                                    <TableCell>Asset Name</TableCell>
                                    <TableCell>Asset Quantity</TableCell>
                                    <TableCell>Total Asset Amount (USD)</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.map((transaction: any) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell>{transaction.time_transacted}</TableCell>
                                        <TableCell>{transaction.transaction_type}</TableCell>
                                        <TableCell>{transaction.asset_name}</TableCell>
                                        <TableCell>{transaction.asset_quantity}</TableCell>
                                        <TableCell>{transaction.total_asset_amount_usd}</TableCell>
                                        <TableCell>
                                            <Button color="inherit" onClick={() => handleDeleteTransaction(transaction.id)} variant="contained">Delete</Button>
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
            }
        </>
    )
}

export default TransactionTable
