import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from '../../Components/Nav/Nav'

export default function MainLayout() {
  return (
   <div className='bg-brand-gradient min-h-screen'>


   <Nav/>
   <Outlet/>
   </div>
  )
}
