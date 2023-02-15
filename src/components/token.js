import React, { useState, useEffect } from 'react';
function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:  useEffect(() => {    // Update the document title using the browser API    document.title = `You clicked ${count} times`;  });
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
function Token() {
    const { status, connect, account, chainId, ethereum } = useMetaMask();
    let href="#",
    onClick, 
    text;
    if (status === "initializing"){
        text = "Synchronisation with MetaMask ongoing...";
    }else if (status === "unavailable"){
        text = "Install MetaMask";
        href = "https://metamask.io/download/"
    }else if (status === "notConnected"){
    // <button onClick={connect}>Connect to MetaMask</button>
        text = "Connect to MetaMask";
        onClick = connect
    }else if (status === "connecting"){
        text = "Connecting...";
    }else if (status === "connected"){

        text = `Connected account {account} on chain ID {chainId}`;
    }

  return (
    <>
        <a className="btn btn-outline-primary my-2 my-sm-0" onClick={onClick} href={href}>{text}</a>
    </>
  );
}

export default Token;