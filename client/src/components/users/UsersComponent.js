import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Tab, Nav } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Spinner } from 'react-bootstrap'
import UserRoleComponent from './UserRoleComponent'
import { getAllUsers } from '../../actions/users'


const UsersComponent = ({ users, getAllUsers }) => {
  useEffect(() => {
    getAllUsers();
  }, []);
  const currentPill = localStorage.__currentPill_user || 'all';
  const onSelect = (pill) => {
    localStorage.setItem('__currentPill_user', pill);
  }
  console.log(users)

  return (
    <Tab.Container id="left-tabs-example" unmountOnExit={true} onSelect={onSelect} defaultActiveKey={currentPill}>
      <Nav variant="tabs" className="mt-5 justify-content-center">
        <Nav.Item>
          <Nav.Link eventKey="all" >All</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="linguist">Linguist</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="reviewer">Reviewer</Nav.Link>
        </Nav.Item>
      </Nav>
      {users.loading ? <div className="d-flex justify-content-center">
        <Spinner animation="grow" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div> :
        <Tab.Content className="mt-3">
          <Tab.Pane eventKey="all">
            <UserRoleComponent
              caption="List of all Users"
              userData={users.all_users}
            />
          </Tab.Pane>
          <Tab.Pane eventKey="linguist">
            <UserRoleComponent
              caption="List of all Linguist"
              userData={users.all_users.filter(user => user.role === 'Linguist')}
            />
          </Tab.Pane>
          <Tab.Pane eventKey="reviewer">
            <UserRoleComponent
              caption="List of all Reviewer"
              userData={users.all_users.filter(user => user.role === 'Reviewer')}
            />
          </Tab.Pane>
        </Tab.Content>
      }
    </Tab.Container>
  )
}

UsersComponent.propTypes = {
  users: PropTypes.object.isRequired,
  getAllUsers: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  users: state.users
})

export default connect(mapStateToProps, { getAllUsers })(UsersComponent)
