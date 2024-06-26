navigate('market');
console.log("START")
function buySeeds(seedType) {
    fetch(middlewareHost + "/purchases", {
        method: "POST",
        body: JSON.stringify({
            userId: userId,
            seedType: seedType
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
        if(!data.success){
            document.getElementById('successMessage').textContent = data.error;
        }else{
            document.getElementById('successMessage').textContent = 'Вы купили картошку';
            document.getElementById('user-balance').textContent = data.balance;
        }
    });
}

function navigate(page) {
    var pages = document.getElementsByClassName('page');
    for (var i = 0; i < pages.length; i++) {
        pages[i].style.display = 'none';
    }
    document.getElementById(page).style.display = 'block';
}
async function sendTransaction() {
    let transactionValue = document.getElementById('transaction-value').value;
    try {

        const transaction = {
            validUntil: Math.floor(new Date() / 1000) + 360,
            messages: [
                {
                    address: "UQA3234a9rmihoxA9BNH7X0qH-tDC0kOYkrsFPfJ4oX73B7E",
                    amount: (transactionValue*(10**9)).toString() //Toncoin in nanotons
                }
            ]
        }
        const result = await tonConnectUI.sendTransaction(transaction);

        fetch(middlewareHost + "/deposit", {
            method: "POST",
            body: JSON.stringify({
                amount: transactionValue,
                address: tonConnectUI.account.address,
                boc: result.boc
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
            document.getElementById('user-balance').textContent = data.user.balance;
            let count = 0;
            const limit = 30;
            const interval = 10000;

            const intervalId = setInterval(async () => {
                const result = await checkDeposit(data.msgHash);
                count++;
                if (result && result.transactionType === 'deposit' || count >= limit) {
                    clearInterval(intervalId);
                }
            }, interval);
        });

    } catch (error) {
        console.error("Failed to send transaction:", error);
    }
}

async function checkDeposit(msgHash) {
    try {
        const response = await fetch(middlewareHost + "/status-deposit", {
            method: "POST",
            body: JSON.stringify({
                userId: userId,
                msgHash: msgHash
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const data = await response.json();
        document.getElementById('user-balance').textContent = data.balance;

        return data;  // Возвращаем данные для проверки статуса транзакции
    } catch (error) {
        console.error('Error processing deposit status:', error);
        return null;  // Возвращаем null в случае ошибки
    }
}

async function withdraw() {
    let withdrawValue = document.getElementById('withdraw-value').value;
    fetch(middlewareHost+"/withdraw", {
        method: "POST",
        body: JSON.stringify({
            userId: userId,
            amount: withdrawValue.toString()
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
        document.getElementById('user-balance').textContent = data.withdraw.balance;
    });
}

function navigate(pageId) {

    let pages = document.getElementsByClassName('page');
    for (let i = 0; i < pages.length; i++) {
        pages[i].style.display = 'none';
    }
    let navigationElements = document.getElementsByClassName('navigation');
    for (let i = 0; i < navigationElements.length; i++) {
        let buttons = navigationElements[i].getElementsByTagName('button');
        for (let j = 0; j < buttons.length; j++) {
            buttons[j].classList.remove('active');
        }
    }
    document.getElementById(pageId).style.display = 'block';
    if(pageId === 'farm'){
        document.getElementById('farm-error-msg').textContent = '';
        fetch(middlewareHost+"/farm/field", {
            method: "POST",
            body: JSON.stringify({
                userId: userId
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
            if(data.error!=null){
                document.getElementById('farm-error-msg').textContent = data.error;
            }
            data.fields.forEach(farm => {
                document.getElementById('farm-'+farm.seedType).style.display = 'block';
                if(farm.status === 'planted'){
                    document.getElementById('farm-'+farm.seedType+'-planted').style.display = 'block';
                }else if(farm.status === 'harvest'){
                    document.getElementById('farm-'+farm.seedType+'-btn').style.display = 'block';
                }
            })
        });
    }
}