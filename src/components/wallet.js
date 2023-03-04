import React, { useState} from 'react';
import { useMetaMask } from "metamask-react";
import {API} from '../scripts/utils';

function Wallet() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [accountId, setAccountId] = useState(localStorage.getItem("accountId"));
    // const [text, setText] = useState();
    const [text2sign, setText2sign] = useState("");
    let { status, connect, account, chainId, ethereum } = useMetaMask();
    let href="#",
    onClick, 
    text;
    const logout = () => {
        console.log("logout");
        localStorage.setItem("token", "");
        localStorage.setItem("accountId", "");
    };
    if (status === "initializing"){
        text = "Synchronisation with MetaMask ongoing...";
        //logout();
    }else if (status === "unavailable"){
        text = "Install MetaMask";
        href = "https://metamask.io/download/"
        //logout();
    }else if (status === "notConnected"){
        text = "Connect to MetaMask";
        onClick = connect;
        logout();
    }else if (status === "connecting"){
        text = "Connecting...";
        //logout();
    }else if (status === "connected"){
        if (!text2sign){
            text = `Getting signature text`;
            API.account.getText2Sign(account).then(
                setText2sign
            );
        }else if (!token){
            // logout();
            text = `Login`;
            onClick = () => {
                console.log("login");
                ethereum.request({method: 'personal_sign', params: [account, text2sign]}).then(
                    signature => setToken(`${text2sign} ${signature}`)
                )
            }
        }else {
            localStorage.setItem("token", token);
            text = 'Log out';
            onClick = () => {
                logout();
                setToken("");
            };
            if (!accountId){
                console.log("getting accountID");
                API.account.getAcount(account, chainId).then(userAccount => {
                    console.log(userAccount);
                    setAccountId(userAccount.id);
                    localStorage.setItem('accountId', userAccount.id);
                    window.location.reload(true);
                }).catch(() => {
                    console.log("unable to get accountId");
                    API.account.createWallet(chainId).then(() => {
                        setAccountId("");
                    });
                });
            }else{
                console.log("accountID exists", accountId);
            }
        }
    }

  return (
    <>
        <a className="btn btn-outline-primary my-2 my-sm-0" onClick={onClick} href={href}>{text}</a>
    </>
  );
}

export default Wallet;

// context API
// redux
