import Container from 'react-bootstrap/Container';
function Msg() {
  let msg = "";
  let className = {}
  if (process.env.REACT_APP_APPLICATION_MODE === "TESTNET"){
    msg = "You are visiting application on testnet mode";
    className = "p-3 mb-2 bg-warning text-dark";
  }
  return (
    <>
      <div className={className}>
        <Container>
            {msg}
        </Container>
      </div>
    </>
  );
}

export default Msg;

