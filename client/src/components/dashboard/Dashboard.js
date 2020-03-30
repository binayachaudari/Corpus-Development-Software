import React from 'react'
import PropTypes from 'prop-types'
import ToastComponent from '../alerts/ToastComponent'
import NavBar from './NavBar'

const Dashboard = (props) => {
  return (
    <>
      <ToastComponent></ToastComponent>
      <NavBar></NavBar>
    </>
  )
}

Dashboard.propTypes = {

}

export default Dashboard

