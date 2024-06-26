// Init TWA
Telegram.WebApp.ready();




const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://farmtest-850d9c786338.herokuapp.com/tonconnect-manifest.json',
    buttonRootId: 'ton-connect'
});

tonConnectUI.uiOptions = {
    returnStrategy: 'https://t.me/farmer_2000_Test_bot/farmer_2000_Test_webapp',
    twaReturnUrl: 'https://t.me/farmer_2000_Test_bot/farmer_2000_Test_webapp',
    actionsConfiguration: {
        returnStrategy: 'https://t.me/farmer_2000_Test_bot/farmer_2000_Test_webapp'
    }
};

tonConnectUI.connectionRestored.then(restored => {
    if (restored) {
        console.log(
            'Connection restored. Wallet:',
            JSON.stringify({
                ...tonConnectUI.wallet,
                ...tonConnectUI.walletInfo
            })
        );
    } else {
        console.log('Connection was not restored.');
    }
});

const unsubscribe = tonConnectUI.onSingleWalletModalStateChange(() => {
    const currentAccount = tonConnectUI.account;
    const currentIsConnectedStatus = tonConnectUI.connected;
    if(currentIsConnectedStatus){
        fetch(middlewareHost + "/user", {
            method: "POST",
            body: JSON.stringify({
                address: currentAccount.address
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        }).then(data => {
            userId = data.id;
            document.getElementById('user-balance').textContent = data.balance;
        });
    }

});