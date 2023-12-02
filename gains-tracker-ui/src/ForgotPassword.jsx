import React, { useRef, useState } from "react"
import { useAuth } from "./AuthContext"
import { Link } from "react-router-dom"
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Button, TextField} from "@mui/material";
import Grid from "@mui/material/Grid";

export default function ForgotPassword() {
    const emailRef = useRef()
    const { resetPassword } = useAuth()
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setMessage("")
            setError("")
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage("Check your inbox for further instructions")
        } catch {
            setError("Failed to reset password")
        }

        setLoading(false)
    }

    return (
        <>
            <Card>
                <CardContent>
                    <h2 className="text-center mb-4">Password Reset</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {message && <Alert variant="success">{message}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <Grid container direction={"column"} spacing={1}>
                            <Grid item>
                                <TextField inputRef={emailRef} label="email" variant="outlined" />
                            </Grid>
                            <Grid item>
                                <Button disabled={loading} className="w-100" type="submit" variant="contained">
                                    Reset Password
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                    <div className="w-100 text-center mt-3">
                        <Link to="/login">Back to login</Link>
                    </div>
                    <div className="w-100 text-center mt-2">
                        Need an account? <Link to="/signup">Sign Up</Link>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}