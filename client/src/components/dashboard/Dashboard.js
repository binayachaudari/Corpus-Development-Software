import React from 'react'
import PropTypes from 'prop-types'
import { Container } from 'react-bootstrap';
import ToastComponent from '../alerts/ToastComponent'
import NavBar from './NavBar'
import AdminDashboardContents from './AdminDashboardContents';

const Dashboard = (props) => {
  return (
    <>
      <ToastComponent></ToastComponent>
      <NavBar></NavBar>
      <Container fluid>
        <AdminDashboardContents />
      </Container>
    </>
  )
}

Dashboard.propTypes = {

}

export default Dashboard

