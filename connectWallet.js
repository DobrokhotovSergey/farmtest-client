// Init TWA
Telegram.WebApp.ready();

// Event occurs whenever theme settings are changed in the user's Telegram app (including switching to night mode).
Telegram.WebApp.onEvent('themeChanged', function() {
    document.documentElement.className = Telegram.WebApp.colorScheme;
});

// Show main button
Telegram.WebApp.MainButton.setParams({
    text: 'Main Button'
});
Telegram.WebApp.MainButton.onClick(function () {
    Telegram.WebApp.showAlert('Main Button was clicked')
});
Telegram.WebApp.MainButton.show();

// Function to call showPopup API
function showPopup() {
    Telegram.WebApp.showPopup({
        title: 'Title',
        message: 'Some message',
        buttons: [
            {id: 'link', type: 'default', text: 'Open ton.org'},
            {type: 'cancel'},
        ]
    }, function(btn) {
        if (btn === 'link') {
            Telegram.WebApp.openLink('https://ton.org/');
        }
    });
};

// Function to toggle main TWA button
function toggleMainButton() {
    if (Telegram.WebApp.MainButton.isVisible) {
        Telegram.WebApp.MainButton.hide();
    } else {
        Telegram.WebApp.MainButton.show();
    }
};


Telegram.WebApp.setHeaderColor('secondary_bg_color');


Telegram.WebApp.onEvent('themeChanged', function() {
    document.body.setAttribute('style', '--bg-color:' + Telegram.WebApp.backgroundColor);
});


const tonConnectUI = new TON_CONNECT_UI.TonConnectUI({
    manifestUrl: 'https://farmtest-850d9c786338.herokuapp.com/tonconnect-manifest.json',
    buttonRootId: 'ton-connect'
});

tonConnectUI.uiOptions = {
    twaReturnUrl: 'https://t.me/farmer_2000_Test_bot/farmer_2000_Test_webapp'
};


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