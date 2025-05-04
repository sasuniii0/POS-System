function loadCustomerPage(){
    fetch('pages/customer.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('section').innerHTML = data;
        })
        .catch(error => console.error('Error loading customer page:', error));
}

function loadItemPage(){
    fetch('pages/item.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('section').innerHTML = data;
        })
        .catch(error => console.error('Error loading item page:', error));
}

function loadOrderPage(){
    fetch('pages/placeOrder.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('section').innerHTML = data;
        })
        .catch(error => console.error('Error loading order page:', error));
}