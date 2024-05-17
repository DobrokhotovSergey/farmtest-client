// function isLinkToTelegram(url) {
//     // Проверяем, начинается ли URL с 'tg://' или содержит 't.me'
//     return url.startsWith('tg://') || url.includes('t.me');
// }
//
// function isInTWA() {
//     // Эта функция должна определить, запущено ли приложение в среде Telegram Web Apps
//     // Это пример, вам нужно будет определить это на основе реальных данных вашего приложения
//     return window.location.href.includes('t.me');
// }
//
// let finalReturnStrategy;
//
// if (isLinkToTelegram('https://dobrokhotovsergey.github.io/farmtest-client/')) {
//     if (isInTWA()) {
//         finalReturnStrategy = actionsConfiguration.twaReturnUrl;
//         if (!finalReturnStrategy) {
//             finalReturnStrategy = actionsConfiguration.returnStrategy;
//         }
//     } else {
//         finalReturnStrategy = 'none'; // Или другой URL/логика в зависимости от ситуации
//     }
// } else {
//     finalReturnStrategy = actionsConfiguration.returnStrategy;
// }
class CustomTonConnectUI extends TON_CONNECT_UI.TonConnectUI {
    set uiOptions(options) {
        super.uiOptions = options;
        this._uiOptions = options;  // Сохраняем локально
    }

    get uiOptions() {
        return this._uiOptions;  // Возвращаем сохраненные опции
    }
}

const tonConnectUI = new CustomTonConnectUI({
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