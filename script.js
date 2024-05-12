navigate('farm');

function navigate(pageId) {
    var pages = document.getElementsByClassName('page');
    for (var i = 0; i < pages.length; i++) {
        pages[i].style.display = 'none';
    }
    document.getElementById(pageId).style.display = 'block';
}

function changeQuantity(seedType, change) {
    var quantityElement = document.getElementById(seedType + 'Quantity');
    var currentQuantity = parseInt(quantityElement.textContent);
    var newQuantity = currentQuantity + change;
    if (newQuantity >= 0) {
        quantityElement.textContent = newQuantity;
    }
}

function buySeeds(seedType) {
    var quantityElement = document.getElementById(seedType + 'Quantity');
    var quantity = parseInt(quantityElement.textContent);
    if (quantity > 0) {
        document.getElementById('successMessage').textContent = `Успешно куплено ${quantity} тонн(а) ${seedType}.`;
        quantityElement.textContent = '0'; // Сброс количества после покупки
    } else {
        document.getElementById('successMessage').textContent = 'Выберите количество семян для покупки.';
    }
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
                address: currentWalletAddress,
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
        });

    } catch (error) {
        console.error("Failed to send transaction:", error);
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