import React from 'react'
import PropTypes from 'prop-types'
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { logout } from '../../actions/auth'

const adminLinks = (pathname) => (
  <Nav className="mr-auto">
    <Nav.Link href="/dashboard" active={pathname === '/dashboard'}>Dashboard</Nav.Link>
    <Nav.Link href="/assign-task" active={pathname === '/assign-task'}>Assign Task</Nav.Link>
    <Nav.Link href="/users" active={pathname === '/users'}>Users</Nav.Link>
  </Nav>
)

const linguistLinks = (pathname) => (
  < Nav className="mr-auto" >
    <Nav.Link href="/dashboard" active={pathname === '/dashboard'}>Dashboard</Nav.Link>
    <Nav.Link href="translate/assignments" active={pathname === 'translate/assignments'}>Assignments</Nav.Link>
  </Nav >
)

const reviewerLinks = (pathname) => (
  < Nav className="mr-auto" >
    <Nav.Link href="/dashboard" active={pathname === '/dashboard'}>Dashboard</Nav.Link>
    <Nav.Link href="review/assignments" active={pathname === 'review/assignments'}>Assignments</Nav.Link>
  </Nav >
)

const NavBar = ({ history: { location: { pathname } }, auth: { user }, logout }) => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand>
          <Navbar.Text className="text-white">
            {user.role}
          </Navbar.Text>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {(user.role === 'Admin' || user.role === 'Developer') ?
            adminLinks(pathname) : user.role === 'Linguist' ?
              linguistLinks(pathname) : user.role === 'Reviewer' ? reviewerLinks(pathname) : ''}
          <Nav className="justify-content-center mr-auto">
            <Navbar.Brand className="d-none d-lg-block">Corpus Development Software</Navbar.Brand>
          </Nav>
          <Nav>
            <NavDropdown alignRight
              title={<span className="text-warning">{user.name}</span>}
              id="collasible-nav-dropdown">
              <NavDropdown.Item href="/change-password" active={pathname === '/change-password'}>Change Password</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item className="text-primary" href="#logout" onClick={logout}>Log Out</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

NavBar.propTypes = {
  history: PropTypes.object.isRequired,
  user: PropTypes.object,
  logout: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default withRouter(connect(mapStateToProps, { logout })(NavBar))
