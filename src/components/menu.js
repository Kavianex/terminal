import { Outlet } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Wallet from './wallet'

function Menu() {
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">
            <img src="https://www.kavianex.com/logo64.png" width="30" height="30" alt=""/>{' '}
            <span>Kavianex</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="float-right">
            <Nav className="me-auto">
              <Nav.Link href="/">Futures</Nav.Link>
              <Nav.Link href="/assets">Assets</Nav.Link>
              {/* <Nav.Link href="/transactions">Transactions</Nav.Link> */}
            </Nav>
            <Wallet />
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet/>
    </>
  );
}

export default Menu;

