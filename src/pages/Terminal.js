import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import DataTable from 'react-data-table-component';
import { useState } from "react";
import React, { useEffect, useRef } from 'react'; // for tradingview
// import useWebSocket, { ReadyState } from 'react-use-websocket';
import useWebSocket from 'react-use-websocket';
import Wallet from '../components/wallet';
import {API} from '../scripts/utils';
import { toast } from 'react-toastify';
import RangeSlider from 'react-bootstrap-range-slider';

let tvScriptLoadingPromise;
const urlParams = new URLSearchParams(window.location.search);
const symbolsInfo = {
    "BTCUSDT": {"base": "BTC", "quote": "USDT"},
    "ETHUSDT": {"base": "ETH", "quote": "USDT"},
    "ADAUSDT": {"base": "ADA", "quote": "USDT"},
}
const activeSymbols = Object.keys(symbolsInfo);
const symbol = urlParams.get('symbol');
const OrderInput = (balances) => {
    const [orderSide, setOrderSide] = useState("LONG");
    const [orderType, setOrderType] = useState("LIMIT");
    const [orderPrice, setOrderPrice] = useState(0);
    const [orderQuantity, setOrderQuantity] = useState(0);
    const [orderAmount, setOrderAmount] = useState(0);
    const [leverage, setLeverage] = useState(5);
    let amountDisabled = !(orderType === "MARKET" && orderSide === "LONG");
    let priceDisabled = orderType === "MARKET";
    let quantityDisabled = !amountDisabled;
    const sendOrder = async () => {
        let params = {
        "side": orderSide,
        "symbol": symbol,
        "price": orderPrice,
        "quantity": orderQuantity,
        "type": orderType
        };
        API.account.sendOrder(params).then(res => {
            toast("Order queued.", {type: "success"});
        }).catch((e) => {
            toast(e.detail, {type: "error"});
        });           
    };
    let quoteInfo = {
        "name": symbolsInfo[symbol].quote,
        "free": symbolsInfo[symbol].quote in balances? balances[symbolsInfo[symbol].quote].free: 0,
        "locked": symbolsInfo[symbol].quote in balances? balances[symbolsInfo[symbol].quote].locked: 0,
    };
    let baseInfo = {
        "name": symbolsInfo[symbol].base,
        "free": symbolsInfo[symbol].base in balances? balances[symbolsInfo[symbol].base].free: 0,
        "locked": symbolsInfo[symbol].base in balances? balances[symbolsInfo[symbol].base].locked: 0,
    };
      return (
        <>
            <table style={{width: "100%"}}>
                <thead>
                    <tr>
                        <th>Balance</th>
                        <th>Free</th>
                        <th>Locked</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{quoteInfo.name}</td>
                        <td>{quoteInfo.free}</td>
                        <td>{quoteInfo.locked}</td>
                    </tr>
                    {/* <tr>
                        <td>{baseInfo.name}</td>
                        <td>{baseInfo.free}</td>
                        <td>{baseInfo.locked}</td>
                    </tr> */}
                </tbody>
            </table>
                Leverage: {leverage}x
                <br></br>
                <RangeSlider value={leverage} max={50} min={1}
                        variant='primary'
                        disabled={true}
                        tooltip='off'
                        onChange={changeEvent => setLeverage(changeEvent.target.value)}
                        onAfterChange={changeEvent => console.log(changeEvent.target.value)}
                    />
            <Row>
                <Col xm={6}>
                    <div className="d-grid gap-2">
                    <Button variant={orderSide === "LONG" ? "success": "outline-success"} onClick={() => setOrderSide("LONG")}>
                        Long
                    </Button>
                    </div>
                </Col>
                <Col xm={6}>
                    <div className="d-grid gap-2">
                    <Button 
                        variant={orderSide === "SHORT" ? "danger": "outline-danger"} 
                        onClick={() => setOrderSide("SHORT")}>
                        Short
                    </Button>
                    </div>
                </Col>
            </Row>
            <br></br>
            <Row>
                <Col xm={6}>
                    <div className="d-grid gap-2">
                    <Button
                        variant={orderType === "LIMIT" ? "light": "outline-light"} 
                        onClick={() => setOrderType("LIMIT")}>
                        Limit
                    </Button>
                    </div>
                </Col>
                <Col xm={6}>
                    <div className="d-grid gap-2">
                    <Button
                        variant={orderType === "MARKET" ? "light": "outline-light"} 
                        onClick={() => setOrderType("MARKET")}>
                        Market
                    </Button>
                    </div>
                </Col>
            </Row>
            <br></br>
            <InputGroup className="mb-3">
                <InputGroup.Text>Size</InputGroup.Text>
                <Form.Control 
                    type='number'
                    placeholder=""
                    value={quantityDisabled? "": orderQuantity}
                    onChange={(e) => setOrderQuantity(e.target.value)} 
                    disabled={quantityDisabled} />
                <InputGroup.Text>{baseInfo.name}</InputGroup.Text>
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Text>Price</InputGroup.Text>
                <Form.Control 
                    type='number'
                    placeholder="" 
                    value={priceDisabled? "": orderPrice}
                    onChange={(e) => setOrderPrice(e.target.value)} 
                    disabled={priceDisabled}/>
                <InputGroup.Text>USDT</InputGroup.Text>
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Text>Amount</InputGroup.Text>
                <Form.Control 
                    placeholder="" 
                    type='number'
                    onChange={(e) => setOrderAmount(e.target.value)} 
                    disabled={amountDisabled} 
                    value={amountDisabled? priceDisabled? "": orderPrice * orderQuantity: orderAmount}
                    />
                <InputGroup.Text>USDT</InputGroup.Text>
            </InputGroup>
            <div className="d-grid gap-2">
                {
                    localStorage.getItem('token')? (
                        <Button 
                            variant={orderSide === "LONG" ? "success": "danger"}
                            onClick={sendOrder}
                            >
                            {orderSide.toTitleCase()} BTC
                        </Button>
                    ) : (
                        <Wallet />
                    )
                }
            </div>
        </>
    )
}

const OrderBook = (depth) => {
    let bids = Object.keys(depth.bids).sort((x,y) => y - x).map(bid => [parseFloat(bid), depth.bids[bid]]).filter(o => o[1] > 0);
    let asks = Object.keys(depth.asks).sort((x,y) => x - y).map(ask => [parseFloat(ask), depth.asks[ask]]).filter(o => o[1] > 0);
    return (
        <>
            <Form.Select defaultValue={symbol} onChange={(e) => {window.location = "/?symbol="+e.target.value}}>
                {activeSymbols.map(function(_symbol, i){
                    return <option value={_symbol} key={i}>{_symbol}</option>;
                })}
            </Form.Select>
            <Row style={{"overflowY": "scroll", "maxHeight": "350px"}}>
                <Col>
                    <table style={{"width": "100%"}}>
                        <thead>
                            <tr>
                                <th>size</th>
                                <th>bid</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bids.map(function(bid, i){
                                return <tr key={i}><td>{bid[1]}</td><td>{bid[0]}</td></tr>;
                            })}
                        </tbody>
                    </table>

                </Col>
                <Col>
                    <table style={{"width": "100%"}}>
                        <thead>
                            <tr>
                                <th>ask</th>
                                <th>size</th>
                            </tr>
                        </thead>
                        <tbody>
                            {asks.map(function(ask, i){
                                return <tr key={i}><td>{ask[0]}</td><td>{ask[1]}</td></tr>;
                            })}
                        </tbody>
                    </table>
                </Col>
            </Row>
        </>
    )
}

const TradingViewWidget = () => {
    const onLoadScriptRef = useRef();

    useEffect(
        () => {
        onLoadScriptRef.current = createWidget;

        if (!tvScriptLoadingPromise) {
            tvScriptLoadingPromise = new Promise((resolve) => {
            const script = document.createElement('script');
            script.id = 'tradingview-widget-loading-script';
            script.src = 'https://s3.tradingview.com/tv.js';
            script.type = 'text/javascript';
            script.onload = resolve;

            document.head.appendChild(script);
            });
        }

        tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

        return () => onLoadScriptRef.current = null;

        function createWidget() {
            if (document.getElementById('tradingview_455ce') && 'TradingView' in window) {
            new window.TradingView.widget({
                autosize: true,
                symbol: "BINANCE:"+symbol,
                interval: "D",
                timezone: "Etc/UTC",
                theme: "light",
                style: "1",
                locale: "en",
                toolbar_bg: "#f1f3f6",
                enable_publishing: false,
                save_image: false,
                container_id: "tradingview_455ce"
            });
            }
        }
        },
        []
    );

    return (
        <>
        <div className='tradingview-widget-container' style={{height: '100%'}}>
        <div id='tradingview_455ce' style={{height: '100%'}}/>
        {/* <div className="tradingview-widget-copyright">
            <a href="https://www.tradingview.com/symbols/BTCUSDT/?exchange=BINANCE" rel="noopener" target="_blank"><span className="blue-text">BTCUSDT chart</span></a> by TradingView
        </div> */}
        </div>

        </>
    );
}

const TerminalTable = (TerminalTableData) => {
    const [ordersTableMode, setOrdersTableMode] = useState("openOrders");
    let commonColumns = [
        {
            name: 'Symbol',
            selector: row => row.symbol,
        },
        {
            name: 'Side',
            selector: row => row.side,
        },
        {
            name: 'Type',
            selector: row => row.type,
        },
        {
            name: 'Quantity',
            selector: row => row.quantity,
        },
        {
            name: 'Price',
            selector: row => row.price,
        },
        {
            name: 'Status',
            selector: row => row.status,
        },
    ];
    const openColumns = [...commonColumns,
        {
            name: 'Action',
            selector: row => <Button 
                        variant="outline-danger"
                        onClick={() => {API.account.cancelOrderById(row.id)}}>
                        cancel
                    </Button>,
        },
    ];
    const historyColumns = [...commonColumns,
        {
            name: 'FilledQuantity',
            selector: row => row.filled_quantity,
        },
        // {
        //     name: 'FilledQuote',
        //     selector: row => row.filled_quote,
        // },
        // {
        //     name: 'Status',
        //     selector: row => row.status,
        // },
        {
            name: 'Time',
            selector: row => row.insert_time,
        },
    ];
    const openPositionsColumns = [
        {
            name: 'Symbol',
            selector: row => row.symbol,
        },
        {
            name: 'Side',
            selector: row => row.side,
        },
        {
            name: 'Size',
            selector: row => row.size,
        },
        {
            name: 'EntryPrice',
            selector: row => row.entry_price,
        },
        {
            name: 'LiqPrice',
            selector: row => row.liquidation_price,
        },
        {
            name: 'margin',
            selector: row => row.margin,
        },
    ];
    let all_orders = Object.values(TerminalTableData.orders);
    let open_orders = all_orders.filter(d => ["QUEUED", "PLACED"].indexOf(d.status) > -1);
    let history_orders = all_orders.filter(d => ["QUEUED", "PLACED"].indexOf(d.status) === -1);
    let openPositions = Object.values(TerminalTableData.positions);
    let data = [];
    let columns = [];
    if (ordersTableMode === "openOrders"){
        data = open_orders;
        columns = openColumns;
    }else if (ordersTableMode === "historyOrders"){
        data = history_orders;
        columns = historyColumns;
    }else if (ordersTableMode === "openPositions"){
        data = openPositions;
        columns = openPositionsColumns;
    }
    // console.log('data', data);
    // console.log('columns', columns);

    return (
        <>
            <Form.Select defaultValue={ordersTableMode} onChange={(e) => {console.log(e.target.value); setOrdersTableMode(e.target.value)}}>
                <option value="openOrders" >Open Orders</option>
                <option value="openPositions" >Open Positions</option>
                {/* <option value="openOrders" >Open Orders</option> */}
                <option value="historyOrders" >Orders History</option>
            </Form.Select>
           {data&& <DataTable
                columns={columns}
                data={data}
                pagination={true}
            />}
        </>
    );
}
const Terminal = () => {
    if (activeSymbols.indexOf(symbol) === -1){
        window.location = "/?symbol=" + activeSymbols[0];
    }
    const [balances, setBalances] = useState({});
    const [TerminalTableData, setTerminalTableData] = useState({'orders':[], 'positions':[]});
    const [depth, setDepth] = useState({"asks": {}, "bids": {}});
    const { sendJsonMessage } = useWebSocket(`${process.env.REACT_APP_WEBSOCKET_SERVER}/ws/${localStorage.getItem('accountId')}`, {
        onOpen: () => sendJsonMessage({"method": "SUBSCRIBE", "channels": [
                `${symbol}:orderBook`,
                'balance',
                'OrderUpdate',
            ]}),
        onMessage: (message) => {
            let data = JSON.parse(message.data);
            console.log(data);
            let event = data.event;
            if (data.topic === `${symbol}:orderBook`){
                let _depth = {...depth};
                let key = event.side === "LONG"? "bids": "asks";
                _depth[key][parseFloat(event.price)] = parseFloat(event.quantity);
                setDepth(_depth);
            }else if (data.topic === "balance"){
                let _balances = {...balances};
                _balances[event.asset] = {
                    "free": parseFloat(event.free),
                    "locked": parseFloat(event.locked),
                }
                setBalances(_balances);
            }else if (data.topic === "OrderUpdate"){
                let _TerminalTableDataOrders = {...TerminalTableData.orders};
                _TerminalTableDataOrders[event.id] = event;
                setTerminalTableData({'orders': _TerminalTableDataOrders, 'positions': TerminalTableData.positions});
                toast(`Order ${event.status.toLocaleLowerCase()}`, {type: "success"});
            }else if (data.topic === "position"){
                let _TerminalTableDataPositions = {...TerminalTableData.positions};
                _TerminalTableDataPositions[event.symbol] = event;
                setTerminalTableData({'positions': _TerminalTableDataPositions, 'orders': TerminalTableData.orders});
                toast(`Position ${event.symbol.toLocaleLowerCase()} updated`, {type: "success"});
            };
        },
        onClose: (c) => {console.log("ws closed")}, 
        reconnectInterval: 1
    });

    localStorage.setItem("TerminalTradingSymbol", symbol);
    useEffect(
        ()=>{
            API.account.getOrders(symbol, "historyOrders").then(ordersData => {
                let _TerminalTableDataOrders = {};
                ordersData.map(order => {
                    _TerminalTableDataOrders[order.id] = order;
                    return 0
                });

                API.account.getOpenPositions().then(positionsData => {
                    let _TerminalTableDataPositions = {};
                    // console.log('positionsData', positionsData);
                    positionsData.map(position => {
                        _TerminalTableDataPositions[position.symbol] = position;
                        return 0
                    });
                    // let new_TerminalTableData = {'positions': _TerminalTableDataPositions, 'orders': TerminalTableData.orders};
                    // console.log('positions', new_TerminalTableData);
                    // setTerminalTableData(new_TerminalTableData);
                    // setTerminalTableData();
                    // setTerminalTableData(_TerminalTableDataPositions);
                    let new_TerminalTableData = {'positions': _TerminalTableDataPositions, 'orders': _TerminalTableDataOrders};
                    // console.log('new_TerminalTableData', new_TerminalTableData);
                    setTerminalTableData(new_TerminalTableData);
                
                }).catch(() => {
                });




                // let new_TerminalTableData = {'orders': _TerminalTableDataOrders, 'positions': TerminalTableData.positions};
                // console.log('orders', new_TerminalTableData);
                // setTerminalTableData(new_TerminalTableData);
                // setTerminalTableData(_TerminalTableDataOrders);
            }).catch(() => {
            });
            // API.account.getOpenPositions().then(positionsData => {
            //     let _TerminalTableDataPositions = {};
            //     positionsData.map(position => {
            //         _TerminalTableDataPositions[position.symbol] = position;
            //         return 0
            //     });
            //     let new_TerminalTableData = {'positions': _TerminalTableDataPositions, 'orders': TerminalTableData.orders};
            //     console.log('positions', new_TerminalTableData);
            //     setTerminalTableData(new_TerminalTableData);
            //     // setTerminalTableData();
            //     // setTerminalTableData(_TerminalTableDataPositions);
            // }).catch(() => {
            // });

            API.account.getOrderBook(symbol).then(orderbook => {
                let _depth = {"asks": {}, "bids": {}};
                orderbook.map(open_order => {
                    let key = open_order.side === "LONG"? "bids": "asks";
                    _depth[key][parseFloat(open_order.price)] = parseFloat(open_order.quantity);
                    return 0
                });
                setDepth(_depth);
            }).catch(() => {
            });


            API.account.getBalances().then(balancesList => {
                let _balances = {};
                balancesList.map((b => {
                    _balances[b.asset] = {
                        free: b.free,
                        locked: b.locked
                    };
                    return 0
                }))
                setBalances(_balances);
            }).catch(() => {
                setBalances({});
            });           
        },
        []
    );
    // const notify = () => toast("Wow so easy!");
    return (
        <>
        {/* <Button  onClick={notify}>Show Toast</Button> */}
            <Row>
                <Col sm={6}>
                    {TradingViewWidget()}
                </Col>
                <Col sm={3} style={{height: "100%"}}>
                    {OrderBook(depth)}
                </Col>
                <Col sm={3}>
                    {OrderInput(balances)}
                </Col>
            </Row>
            <br></br>
            {TerminalTable(TerminalTableData)}
            {/* <TerminalTable TerminalTableData={TerminalTableData}/> */}
        </>
    )
};

export default Terminal;
