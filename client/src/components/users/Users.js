import React from 'react'
import PropTypes from 'prop-types'
import { Container } from 'react-bootstrap'
import NavBar from '../dashboard/NavBar'
import UsersComponent from './UsersComponent'

const Users = props => {
  return (
    <>
      <NavBar></NavBar>
      <Container>
        <UsersComponent />
      </Container>
    </>
  )
}

Users.propTypes = {

}

export default Users
