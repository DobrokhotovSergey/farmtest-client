const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://farmtest-850d9c786338.herokuapp.com/tonconnect-manifest.json',
    buttonRootId: 'ton-connect'
});

tonConnectUI.uiOptions = {
    twaReturnUrl: 'https://t.me/farmer_2000_Test_bot/farmer_2000_Test_webapp',
    returnStrategy: 'back'
};

const unsubscribe = tonConnectUI.onSingleWalletModalStateChange(() => {
    try {
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
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            }).then(data => {
                document.getElementById('user-balance').textContent = data.balance;
            }).catch(error => {
                console.error('Error during fetch operation:', error.message);
            });
        }
    } catch (error) {
        console.error('Error in wallet modal state change handler:', error.message);
    }
});