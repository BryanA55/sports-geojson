import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './NavBar.css'

function NavBar() {
    return (
      <Navbar expand="lg" fixed="top" className="custom-navbar">
        <Container>
          <Navbar.Brand href="#home">Baseball Stadium GEOJSON</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">MLB</Nav.Link>
              <Nav.Link href="#link">NFL</Nav.Link>
              <Nav.Link href="#link">NBA</Nav.Link>
              <Nav.Link href="#link">NHL</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
  
  export default NavBar;
  