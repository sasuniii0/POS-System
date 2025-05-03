function loadCustomerPage(){
    fetch('pages/customer.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('section').innerHTML = data;
        })
        .catch(error => console.error('Error loading customer page:', error));
}