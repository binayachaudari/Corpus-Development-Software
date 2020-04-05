import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';
import ToastComponent from '../alerts/ToastComponent'
import NavBar from './NavBar'
import AdminDashboardContents from './admin/AdminDashboardContents';
import ReviewerDashboardContents from './reviewer/ReviewerDashBoardContents';

const Dashboard = ({ auth: { user } }) => {
  return (
    <>
      <ToastComponent></ToastComponent>
      <NavBar></NavBar>
      <Container fluid>
        {user.role === 'Admin' || user.role === 'Developer' ? <AdminDashboardContents /> : <ReviewerDashboardContents />}
      </Container>
    </>
  )
}

Dashboard.propTypes = {

}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Dashboard)

