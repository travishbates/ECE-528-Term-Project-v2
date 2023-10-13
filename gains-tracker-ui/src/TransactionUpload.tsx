import * as React from "react";
import Button from "@mui/material/Button";
// @ts-ignore
import { uploadTransactions } from "./backendService";

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
        <form onSubmit={ handleSubmit }>
            <input type="file" name="file"/>
            <Button
                type="submit"
            >
                Upload
            </Button>
        </form>
    )
}

export default TransactionUpload
