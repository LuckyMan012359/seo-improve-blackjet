import Header from 'components/Header'
import React from 'react'
import { Outlet } from 'react-router-dom'

const OnboardingLayout = () => {
  return (
    <>  
        <Header/>
        <Outlet />
    </>
  )
}

export default OnboardingLayout