import React from 'react';
import PropTypes from 'prop-types';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';
import { slideInAnimation } from '../../utils/slideInAnimation';

const adminLinks = (pathname) => (
  <Nav className="mr-auto">
    <Nav.Link as={Link} to="/dashboard" {...slideInAnimation(0.3)} active={pathname === '/dashboard'}>
      Dashboard
    </Nav.Link>
    <Nav.Link as={Link} to="/assign-task" {...slideInAnimation(0.4)} active={pathname === '/assign-task'}>
      Assign Task
    </Nav.Link>
    <Nav.Link as={Link} to="/add-user" {...slideInAnimation(0.5)} active={pathname === '/add-user'}>
      Add User
    </Nav.Link>
    <Nav.Link as={Link} to="/users" {...slideInAnimation(0.6)} active={pathname === '/users'}>
      Users
    </Nav.Link>
  </Nav>
);

const linguistLinks = (pathname) => (
  <Nav className="mr-auto">
    <Nav.Link as={Link} to="/dashboard" {...slideInAnimation(0.3)} active={pathname === '/dashboard'}>
      Dashboard
    </Nav.Link>
    <Nav.Link
      as={Link}
      to="/translate/assignments"
      {...slideInAnimation(0.4)}
      active={pathname === '/translate/assignments'}
    >
      Assignments
    </Nav.Link>
  </Nav>
);

const reviewerLinks = (pathname) => (
  <Nav className="mr-auto">
    <Nav.Link as={Link} to="/dashboard" {...slideInAnimation(0.3)} active={pathname === '/dashboard'}>
      Dashboard
    </Nav.Link>
    <Nav.Link as={Link} to="/review/assignments" {...slideInAnimation(0.4)} active={pathname === '/review/assignments'}>
      Assignments
    </Nav.Link>
  </Nav>
);

const NavBar = ({
  history: {
    location: { pathname }
  },
  auth: { user },
  logout
}) => {
  return (
    <Navbar className="navbar__reveal" collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container fluid>
        <Navbar.Brand {...slideInAnimation(0.2)}>
          <Navbar.Text className="text-white">{user.role}</Navbar.Text>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {user.role === 'Admin' || user.role === 'Developer'
            ? adminLinks(pathname)
            : user.role === 'Linguist'
            ? linguistLinks(pathname)
            : user.role === 'Reviewer'
            ? reviewerLinks(pathname)
            : ''}
          <Nav className="justify-content-center mr-auto">
            <Navbar.Brand className="d-none d-lg-block slidein__animation" style={{ animationDelay: '0.9' }}>
              {' '}
              Corpus Development Software
            </Navbar.Brand>
          </Nav>
          <Nav>
            <NavDropdown
              alignRight
              className="slidein__animation"
              style={{ animationDelay: '0.9s', zIndex: '10' }}
              title={<span className="text-warning">{user.name}</span>}
              id="collasible-nav-dropdown"
            >
              <NavDropdown.Item
                as={Link}
                to="/change-password"
                active={pathname === '/change-password'}
                {...slideInAnimation(0.2)}
              >
                Change Password
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                className="text-primary"
                as={Link}
                to="#logout"
                onClick={logout}
                {...slideInAnimation(0.4)}
              >
                Log Out
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

NavBar.propTypes = {
  history: PropTypes.object.isRequired,
  user: PropTypes.object,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default withRouter(connect(mapStateToProps, { logout })(NavBar));
