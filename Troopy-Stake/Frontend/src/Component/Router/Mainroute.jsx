import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Index from '../Index'
import Login from '../Auth/Login'
import Registration from '../Auth/Registration'
import 'bootstrap/dist/css/bootstrap.min.css';
import SuperAdmin from '../Supper_admin/Supper_admin'

function Mainroute() {
  return (
    <Routes>
      <Route path='/' element={<Index/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/registration' element={<Registration/>}/>
      <Route path='/superadmin' element={<SuperAdmin/>}/>
  
    </Routes>

  )
}

export default Mainroute