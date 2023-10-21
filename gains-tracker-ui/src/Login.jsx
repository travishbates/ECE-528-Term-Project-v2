import React, { useRef, useState } from "react"
import { useAuth } from "./AuthContext"
import { Link } from "react-router-dom"
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {Button, TextField} from "@mui/material";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom"

export default function Login() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { login } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError("")
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            navigate("/")
        } catch {
            setError("Failed to log in")
        }

        setLoading(false)
    }

    return (
        <>
            <p>login</p>
            <Card>
                <CardContent>
                            <h2 className="">Log In</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <form onSubmit={handleSubmit}>
                                <TextField inputRef={emailRef} label="email" variant="outlined" />
                                <TextField inputRef={passwordRef} label="password" type="password" variant="outlined" />
                                <Button disabled={loading} className="w-100" type="submit">
                                    Log In
                                </Button>
                            </form>
                            <div className="w-100 text-center mt-3">
                                <Link to="/forgot-password">Forgot Password?</Link>
                            </div>
                </CardContent>
            </Card>
            <div className="w-100 text-center mt-2">
                Need an account? <Link to="/signup">Sign Up</Link>
            </div>
        </>
    )
}