import React from 'react'
import PropTypes from 'prop-types'
import { Container } from 'react-bootstrap'

import UsersComponent from './UsersComponent'

const Users = props => {
  return (
    <>
      <Container>
        <UsersComponent />
      </Container>
    </>
  )
}

Users.propTypes = {

}

export default Users
