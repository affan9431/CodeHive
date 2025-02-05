import React from 'react'
import Header from '../component/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../component/Footer'

export default function AppLayout() {
  return (
    <>
    <Header/>
    <div>
        <Outlet/>
    </div>
    <Footer />

    </>
  )
}
