import { useState } from 'react';
import DataTable from 'react-data-table-component';
// import Button from 'react-bootstrap/Button';
import {API} from '../scripts/utils';
import Wallet from '../components/wallet';


const columns = [
    {
        name: 'Asset',
        selector: row => row.asset,
	    	sortable: true,
    },
    {
        name: 'Free',
        selector: row => row.free,
	    	sortable: true,
    },
    {
        name: 'Locked',
        selector: row => row.locked,
	    	sortable: true,
    },
    // {
    //     name: 'Action',
    //     selector: row => (
    //         <>
    //             <Button 
    //                 variant="outline-primary">
    //                 deposit
    //             </Button>{'   '}
    //             <Button 
    //                 variant="outline-primary">
    //                 withdraw
    //             </Button>
    //         </>
    //     )
    // },
];
const setFreeBalance = () => {
    API.account.setFreeBalance().then(()=>{window.location.reload(true)});
}


const Assets = () => {
    const [balances, setBalances] = useState({});
    let rows = [];
    if (Object.keys(balances).length === 0){
        API.account.getBalances(localStorage.getItem('accountId')).then(assets => {
            assets.forEach(asset => {
                balances[asset.asset] = {
                    free: asset.free,
                    locked: asset.locked,
                }
            });
            if (Object.keys(balances).length > 0){
                setBalances({...{}, ...balances});
            }
        });  
    }else{
        Object.keys(balances).forEach(asset => {
            rows.push({
                asset: asset,
                free: balances[asset].free,
                locked: balances[asset].locked,
            });
        });
    }
    return (
      <>
        <br></br>
        <h4>Assets overview</h4>
        <br></br>
            {
                localStorage.getItem('token')? (                    
                process.env.REACT_APP_APPLICATION_MODE === "TESTNET"? (
                    <div>
                        <div>
                            <button className="btn btn-outline-primary my-2 my-sm-0" onClick={setFreeBalance}>Set free balance to 10,000 usdt for test</button>
                            <br></br>
                            <span>You should have no open positions and orders</span>
                        </div>
                        <DataTable
                            columns={columns}
                            data={rows}
                        />
                    </div>                    
                ) : (
                    <DataTable
                        columns={columns}
                        data={rows}
                    />
                )
                ) : (
                    <Wallet />
                )
            }
      </>
    );
};

export default Assets;
