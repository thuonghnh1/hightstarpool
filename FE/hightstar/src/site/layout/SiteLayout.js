import React from 'react'

import { Routes, Route } from "react-router-dom";
import {Login, Register, PasswordReset } from "../views/indexsite";

const SiteLayout = () => {



  return (
    
    <div className='d-flex'>
      {/* Trang user */}
      <Routes>
              <Route path="/site/login" element={<Login />} />
              <Route
                path="/site/register"
                element={<Register />}
              />
              <Route
                path="/site/password-reset"
                element={<PasswordReset />}
              />
              
            </Routes>
    </div>
  )
}

export default SiteLayout
