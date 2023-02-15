function loadScript(src) {
    var tag = document.createElement(`script`, {
      width: 1000,
      height: 490,
      defaultColumn: "overview",
      screener_type: "crypto_mkt",
      displayCurrency: "USD",
      colorTheme: "light",
      transparency: false,
      locale: "en",
    });
    tag.async = true;
    tag.type = 'text/javascript';
    tag.src = src;
    document.getElementsByTagName('div')[0].appendChild(tag);
}

function CryptoMarket(){
    return (
        <>
            <div className="tradingview-widget-container">
            <div className="tradingview-widget-container__widget"></div>
            {loadScript('https://s3.tradingview.com/external-embedding/embed-widget-screener.js')}
            </div>
        </>
    )
}
export default CryptoMarket;
