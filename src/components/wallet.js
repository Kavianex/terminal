import React, { useEffect, useState} from 'react';
import { useMetaMask } from "metamask-react";
import {API} from '../scripts/utils';

function Wallet() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [accountId, setAccountId] = useState(localStorage.getItem("accountId"));
    const [network, setNetwork] = useState({});
    const [text2sign, setText2sign] = useState("");
    let { status, connect, account, chainId, ethereum } = useMetaMask();
    let href="#",
    onClick, 
    text;
    useEffect(
        ()=>{
            API.account.getNetwork().then(_network => {
                setNetwork({..._network});
            });
        },
        []
    );

    const connectWallet = () => {
        let connected = false;
        console.log(chainId, network.chain_id, "diff:", chainId !== network.chain_id);
        if (chainId !== network.chain_id) {
            console.log("wallet_switchEthereumChain");
            ethereum.request({method: 'wallet_switchEthereumChain', params: [{ chainId: network.chain_id}]}).catch(err => {
                if (err.code === 4902) {
                    ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                        {
                            chainName: network.name,
                            chainId: network.chain_id,
                            nativeCurrency: { name: network.symbol, decimals: 18, symbol: network.symbol },
                            rpcUrls: [network.rpc_url]
                        }
                        ]
                    }).then(
                        ()=>{
                            if (!connected){
                                console.log('connect');
                                connect();
                                connected = true;
                            }
                            console.log('login');
                        }
                    );
                }
            }).then(
                ()=>{
                    console.log("wallet_switchEthereumChain done");
                    if (!connected){
                        console.log('connect');
                        connect();
                        connected = true;
                    }
                }
                // connectWallet
            );
        }else{
            connect();
            // login();
        }
    }
    const logout = () => {
        console.log("logout");
        localStorage.setItem("token", "");
        localStorage.setItem("accountId", "");
    };
    const login = () => {
        console.log("login");
        ethereum.request({method: 'personal_sign', params: [account, text2sign]}).then(
            signature => {
                setToken(`${text2sign} ${signature}`);
            }
        )
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
        onClick = connectWallet;
        // onClick = connect;
        logout();
    }else if (status === "connecting"){
        text = "Connecting...";
        //logout();
    }else if (status === "connected"){
        if (!text2sign){
            text = `Getting signature text`;
            onClick = () => {window.location.reload(true);}
            API.account.getText2Sign(account).then(
                setText2sign
            );
        }else if (!token){
            // logout();
            text = `Login`;
            onClick = login;
            // login();
        }else {
            let tokenExpire = parseInt(token.split(' ')[0].split(":")[1]); 
            let now = new Date();
            if (now > tokenExpire){
                logout();
                setToken("");
            }
            localStorage.setItem("token", token);
            text = 'Log out';
            onClick = () => {
                logout();
                setToken("");
            };
            if (!accountId){
                console.log("getting accountID");
                API.account.getAccount(account, chainId).then(userAccount => {
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
