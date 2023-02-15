// import logo from './logo.svg';
// import CryptoMarket from './components/cryptomarket';
// import { useMetaMask } from "metamask-react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Assets from "./pages/Assets";
import Transactions from "./pages/Transactions";
import Terminal from "./pages/Terminal"
import Menu from './components/menu';
import Msg from './components/msg';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
    <Msg/>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />}>
          <Route index element={<Terminal />} />
          <Route path="assets" element={<Container><Assets /></Container>} />
          <Route path="transactions" element={<Container><Transactions /></Container>} />
        </Route>
      </Routes>
    </BrowserRouter>
    <ToastContainer 
      position="top-right"
      autoClose={1000}
    />
    </>
  );
}

export default App;
