import React, { useRef, useState } from "react"
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Button, TextField} from "@mui/material";
import { useAuth } from "./AuthContext"
import {Link, useNavigate} from "react-router-dom"
import Alert from "@mui/material/Alert";

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
                        <TextField inputRef={emailRef} label="email" variant="outlined" />
                        <TextField inputRef={passwordRef} label="password" type="password" variant="outlined" />
                        <TextField inputRef={passwordConfirmRef} label="password-confirm" type="password" variant="outlined" />
                        <Button disabled={loading} className="w-100" type="submit">
                            Sign Up
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <div className="w-100 text-center mt-2">
                Already have an account? <Link to="/login">Log In</Link>
            </div>
        </>
    )
}