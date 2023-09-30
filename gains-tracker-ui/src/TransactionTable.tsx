import {TableContainer} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import * as React from "react";
import {useEffect} from "react";

function TransactionTable() {
    const [transactions, setTransactions] = React.useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/sample-transactions")
            .then(response => response.json())
            .then((result) => {
                setTransactions(result);
            });
    });

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
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow key={transaction.time}>
                            <TableCell>{transaction.time}</TableCell>
                            <TableCell>{transaction.assetBoughtName}</TableCell>
                            <TableCell>{transaction.assetBoughtAmount}</TableCell>
                            <TableCell>{transaction.assetSoldName}</TableCell>
                            <TableCell>{transaction.assetSoldAmount}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TransactionTable
