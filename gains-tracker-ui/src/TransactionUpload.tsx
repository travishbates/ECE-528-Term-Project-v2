import * as React from "react";
import Button from "@mui/material/Button";
// @ts-ignore
import { uploadTransactions } from "./backendService";
import {CardContent} from "@mui/material";
import Card from "@mui/material/Card";

interface TransactionUploadProps {
    refreshTransactions: () => void
}
const TransactionUpload: React.FC<TransactionUploadProps> = ({ refreshTransactions }) => {

    const handleSubmit = (event: any) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        uploadTransactions(formData)
            .then(() => {
                refreshTransactions();
            });
    }

    return (
        <>
            <h2>Upload Transactions</h2>
            <form onSubmit={ handleSubmit }>
                <Card>
                    <CardContent>
                        <input type="file" name="file"/>
                        <Button
                            type="submit"
                            variant="contained"
                        >
                            Upload
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </>
    )
}

export default TransactionUpload
