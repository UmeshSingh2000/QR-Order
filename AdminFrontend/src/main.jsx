import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PrivateRoute from './Pages/PrivateRoute.jsx'
import AdminLayout from './Pages/AdminLayout.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route element={<PrivateRoute />} >
        <Route path="/admin/dashboard" element={<AdminLayout />} />
      </Route>
    </Routes>
  </BrowserRouter>,

)
