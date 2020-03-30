import React from 'react'
import PropTypes from 'prop-types'
import { Navbar, Container, Nav, Form, Button, FormControl } from 'react-bootstrap'

const NavBar = props => {
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="#home">Navbar</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#features">Features</Nav.Link>
          <Nav.Link href="#pricing">Pricing</Nav.Link>
        </Nav>
        <Form inline>
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-info">Search</Button>
        </Form>
      </Container>
    </Navbar>
  )
}

NavBar.propTypes = {

}

export default NavBar
