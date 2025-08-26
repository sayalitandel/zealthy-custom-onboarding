import App from './App.jsx';
import './App.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import AdminPage from './pages/AdminPage.jsx'
import DataPage from './pages/DataPage.jsx'
import Wizard from './pages/Wizard.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
