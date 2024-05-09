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
        messages: [
            {
                address: "UQCRCL1GG-4dN9hE58H1oqWD-hwFhEf0-YCsVdYVChSXt_xj", // destination address
                amount: (value*(10**9)).toString() //Toncoin in nanotons
            }
        ]
    }
    const result = await tonConnectUI.sendTransaction(transaction)
}

async function withdraw(value) {
    address = tonConnectUI.account.address
    // тут просто шлем запрос на вывод
}