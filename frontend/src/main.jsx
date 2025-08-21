import './app.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Link } from 'react-router-dom'
import AdminPage from './pages/AdminPage.jsx'
import DataPage from './pages/DataPage.jsx'
import Wizard from './pages/Wizard.jsx'

function Home() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Custom Onboarding</h2>
      <p>
        <Link to="/admin">Admin</Link> · <Link to="/data">Data</Link>
      </p>
      <Wizard />
    </div>
  )
}

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/admin', element: <AdminPage /> },
  { path: '/data', element: <DataPage /> },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
