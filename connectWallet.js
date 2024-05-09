const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://farmtest-850d9c786338.herokuapp.com/tonconnect-manifest.json',
    buttonRootId: 'ton-connect'
});

tonConnectUI.uiOptions = {
    twaReturnUrl: 't.me/farmer_2000_Test_bot/farmer_2000_Test_webapp'
};
// https://t.me/MomoAI_bot/app?startapp=FDAHAO

async function connectToWallet() {
    const connectedWallet = await tonConnectUI.connectWallet();
    // Do something with connectedWallet if needed
    console.log(connectedWallet);
}

// Call the function
// connectToWallet().catch(error => {
//     console.error("Error connecting to wallet:", error);
// });


// tonConnectUI.uiOptions = {
//     twaReturnUrl: 'https://t.me/farmer_2000_Test_bot?game=farmer2000Test'
// };