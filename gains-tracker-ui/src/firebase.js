import firebase from "firebase/compat/app"
import "firebase/compat/auth"

const API_KEY = import.meta.env.VITE_API_KEY;
const AUTH_DOMAIN = import.meta.env.VITE_AUTH_DOMAIN;

const app = firebase.initializeApp({
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
})

export const auth = app.auth()
export default app