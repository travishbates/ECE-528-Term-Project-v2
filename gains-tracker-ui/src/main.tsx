import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import createTheme from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import {CssBaseline} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const theme = createTheme({
    palette: {
        mode: 'dark'
    }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ThemeProvider theme={theme}>
              <CssBaseline />
              <BrowserRouter>
                  <App />
              </BrowserRouter>
          </ThemeProvider>
      </LocalizationProvider>
  </React.StrictMode>,
)
