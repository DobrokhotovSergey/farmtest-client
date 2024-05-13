navigate('market');

function navigate(pageId) {
    var pages = document.getElementsByClassName('page');
    for (var i = 0; i < pages.length; i++) {
        pages[i].style.display = 'none';
    }
    document.getElementById(pageId).style.display = 'block';
    if(pageId == 'farm'){
        const address = tonConnectUI.account.address
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

        });
    }
}


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

async function sendTransaction(value) {
    const transaction = {
        validUntil: Math.floor(new Date() / 1000) + 360,
        messages: [
            {
                //address: "UQCRCL1GG-4dN9hE58H1oqWD-hwFhEf0-YCsVdYVChSXt_xj", // destination address
                address: "UQBZ3HVqTZOliLMe5-LKxBtca6PxYBcISIFRazhjNdO03HmV",
                amount: (value*(10**9)).toString() //Toncoin in nanotons
            }
        ]
    }
    try {
        const result = await tonConnectUI.sendTransaction(transaction);
        fetch(middlewareHost + "/deposit", {
            method: "POST",
            body: JSON.stringify({
                amount: value,
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

async function withdraw(value) {
    const address = tonConnectUI.account.address
    fetch(middlewareHost+"/withdraw", {
        method: "POST",
        body: JSON.stringify({
            address: address,
            value: value.toString()
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
}

async function collectHarvest(seedType) {
    const address = tonConnectUI.account.address
    fetch(middlewareHost+"/farm/collect-harvest", {
        method: "POST",
        body: JSON.stringify({
            address: address,
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
        if(data.success){
            document.getElementById('successMessage').textContent = JSON.stringify(data);
        }else{
            document.getElementById('errorMessage').textContent = data.error;
        }

    });
}
