import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PrivateRoute from './Pages/PrivateRoute.jsx'
import AdminLayout from './Pages/AdminLayout.jsx'
import Menu from './Pages/Menu.jsx'
import Orders from './Pages/Orders.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route element={<PrivateRoute />} >
        <Route path="/admin/dashboard" element={<AdminLayout />} />
        <Route path="/admin/menu" element={<Menu />} />
        <Route path="/admin/orders" element={<Orders />} />
      </Route>
    </Routes>
  </BrowserRouter>,

)
