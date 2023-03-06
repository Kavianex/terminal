export const API = {};
API.account = {};
API.sendRequest = async function(method, endpoint, params){
  method = method.toUpperCase();
  const private_methods = ["POST", "DELETE", "PUT", "PATCH"];
  let accountId = localStorage.getItem('accountId');
  let request = {
    method: method.toUpperCase(),
    headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    }
  };
  if (accountId) {
    request.headers['account-id'] = accountId;
  }
  if (private_methods.indexOf(method) > -1){
    request.headers.Authorization = localStorage.getItem('token');
    if (params){
      request.body = JSON.stringify(params);
    }
  }else if (params){
      request.params = params;
  }
  try {
    let url = process.env.REACT_APP_API_SERVER + endpoint;
    const response = await fetch(url, request);
    switch(response.status) {
      case 401:
        localStorage.setItem('token', '');
        window.location.reload(true); 
        break;
      // case 400:
      //   console.log(response);
      //   throw new Error('404')
      case 404:
        throw new Error('404')
      default:
        // code block
    }
  return response
  // setData(result);
  } 
  // catch (err) {
  //   console.log(err)
  //     throw new Error()
  //  // setErr(err.message);
  // } 
  finally {
  // setIsLoading(false);
  }
}
API.account.getText2Sign = async (walletAdress) => {
  let response = await API.sendRequest('GET', '/token/text2sign/' + walletAdress);
  let data = await response.json();
  return data.text2sign
}

API.account.getAcount = async (walletAdress, chainId) => {
  let response = await API.sendRequest('GET', `/subAccount/${chainId}/${walletAdress}`);
  let data = await response.json();
  return data[0]
}

API.account.createWallet = async (chainId) => {
  let params = {
    chain_id: chainId,
  };
  let referred_code = localStorage.getItem('referred_code');
  if (referred_code){
    params.referred_code = referred_code;
  }
  let response = await API.sendRequest('POST', `/wallet/`, params);
  let data = await response.json();
  return data.text2sign
}

API.account.getBalances = async () => {
  let accounId = localStorage.getItem('accountId');
  if (!accounId) {return []};
  let response = await API.sendRequest('GET', `/balance/${accounId}`);
  let data = await response.json();
  return data
}
API.account.setFreeBalance = async () => {
  let accounId = localStorage.getItem('accountId');
  if (!accounId) {return []};
  let params = {
    "account_id": accounId,
    "asset": "USDT",
  }
  let response = await API.sendRequest('PUT', `/balance/setFreeBalance`, params);
  let data = await response.json();
  return data
}

API.account.getOrderBook = async (symbol) => {
  let response = await API.sendRequest('GET', `/order/book/${symbol}`);
  let data = await response.json();
  return data
}


API.account.sendOrder = async (params) => {
  let accounId = localStorage.getItem('accountId');
  params['account_id'] = accounId;
  let response = await API.sendRequest('POST', `/order/`, params);
  let data = await response.json();
  if ("id" in data){
    return data
  }else{
    console.log(data);
    throw data
  }
}

API.account.getOrders = async (symbol, mode) => {
  let response,
    accounId = localStorage.getItem('accountId');
  if (!accounId) {return []};
  // if (mode === "openOrders"){
  // console.log(mode, "openOrders");
  //   response = await API.sendRequest('GET', `/order/open/${accounId}/${symbol}`);
  // }else{
  // console.log(mode, 'w');
  //   response = await API.sendRequest('GET', `/order/${accounId}/${symbol}`);
  // }
  response = await API.sendRequest('GET', `/order/${accounId}/${symbol}`);
  let data = await response.json();
  return data
}
API.account.getOpenPositions = async () => {
  let response,
    accounId = localStorage.getItem('accountId');
  if (!accounId) {return []};
  response = await API.sendRequest('GET', `/position/${accounId}`);
  let data = await response.json();
  return data
}


API.account.cancelOrderById = async (orderId) => {
  let response = await API.sendRequest('DELETE', `/order/byId/${orderId}`);
  let data = await response.json();
  return data
}