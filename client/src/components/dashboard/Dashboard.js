import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';
import ToastComponent from '../alerts/ToastComponent'
import AdminDashboardContents from './admin/AdminDashboardContents';
import ReviewerDashboardContents from './reviewer/ReviewerDashboardContents';
import LinguistDashboardContents from './linguist/LinguistDashboardContents';

const Dashboard = ({ auth: { user } }) => {
  return (
    <>
      <ToastComponent></ToastComponent>
      <Container fluid>
        {user.role === 'Admin' || user.role === 'Developer' ? <AdminDashboardContents /> :
          user.role === 'Reviewer' ? <ReviewerDashboardContents /> :
            user.role === 'Linguist' ? <LinguistDashboardContents /> : <h1>{user.role}</h1>}
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

