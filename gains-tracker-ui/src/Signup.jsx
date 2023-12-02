import React, { useRef, useState } from "react"
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Button, TextField} from "@mui/material";
import { useAuth } from "./AuthContext"
import {Link, useNavigate} from "react-router-dom"
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";

export default function Signup() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { signup } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match")
        }

        try {
            setError("")
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value)
            navigate("/")
        } catch {
            setError("Failed to create an account")
        }

        setLoading(false)
    }

    return (
        <>
            <Card>
                <CardContent>
                    <h2 className="text-center mb-4">Sign Up</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <form onSubmit={handleSubmit}>
                        <Grid container direction={"column"} spacing={1}>
                            <Grid item>
                                <TextField inputRef={emailRef} label="email" variant="outlined" />
                            </Grid>
                            <Grid item>
                                <TextField inputRef={passwordRef} label="password" type="password" variant="outlined" />
                            </Grid>
                            <Grid item>
                                <TextField inputRef={passwordConfirmRef} label="password-confirm" type="password" variant="outlined" />
                            </Grid>
                            <Grid item>
                                <Button disabled={loading} className="w-100" type="submit" variant="contained">
                                    Sign Up
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                    <div className="w-100 text-center mt-2">
                        Already have an account? <Link to="/login">Log In</Link>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}