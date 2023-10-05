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
import { deleteTransaction } from "./backendService";

function TransactionTable({ transactions, refreshTransactions }) {

    useEffect(() => {
        refreshTransactions();
    }, []);

    function handleDeleteTransaction(transactionId) {
        deleteTransaction(transactionId)
            .then(() => {
                refreshTransactions();
            });
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell>Asset Bought</TableCell>
                        <TableCell>Asset Bought Amount</TableCell>
                        <TableCell>Asset Sold</TableCell>
                        <TableCell>Asset Sold Amount</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell>{transaction.time_transacted}</TableCell>
                            <TableCell>{transaction.asset_purchased_name}</TableCell>
                            <TableCell>{transaction.asset_purchased_quantity}</TableCell>
                            <TableCell>{transaction.asset_sold_name}</TableCell>
                            <TableCell>{transaction.asset_sold_quantity}</TableCell>
                            <TableCell>
                                <Button color="inherit" onClick={() => handleDeleteTransaction(transaction.id)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TransactionTable
