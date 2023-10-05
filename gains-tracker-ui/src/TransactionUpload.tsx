import * as React from "react";
import Button from "@mui/material/Button";
import { uploadTransactions } from "./backendService";

function TransactionUpload() {

    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);

        uploadTransactions(formData);
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