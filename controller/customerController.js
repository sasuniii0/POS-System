import CustomerModel from "../model/customerModel.js";
import { customer_db } from "../db/db.js";

function clearFields() {
    $('#floatingId').val("");
    $('#floatingName').val("");
    $('#floatingContact').val("");
    $('#floatingEmail').val("");
    $('#floatingNIC').val("");
    $('#floatingAddress').val("");
    $('#floatingGender').val("");
    $('#BtnSubmit').text('Submit');
    $('#BtnReset').text('Reset');
}

$('BtnSubmit').on('click', function (event) {
    event.preventDefault();
    let btnTxt = $('#BtnSubmit').text();

    if (btnTxt === 'Submit') {
        let isNewCustomer = true;

        let custId = $('#floatingId').val();
        let custName = $('#floatingName').val();
        let custContact = $('#floatingContact').val();
        let custEmail = $('#floatingEmail').val();
        let custNIC = $('#floatingNIC').val();
        let custAddress = $('#floatingAddress').val();
        let custGender = $('#floatingGender').val();

        if (custId === "" || custName === "" || custContact === "" || custEmail === "" || custNIC === "" || custAddress === "" || custGender === "") {
            Swal.fire({
                title: "Enter data to All fields",
                icon: 'error'
            });
            return
        }
        customer_db.forEach(function (customer) {
            if (customer.cId === $('#floatingId').val()) {
                Swal.fire({
                    title: "Customer Already exists",
                    text: "Please enter a different ID",
                    icon: "error"
                });
                isNewCustomer = false;
            }
        });

        if (!isNewCustomer) {
            return;
        }
        let customer = new CustomerModel(custId, custName, custContact, custEmail, custNIC, custAddress, custGender);
        customer_db.push(customer);
        clearFields();
        Swal.fire({
            title: "Customer Saved",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
        });
    }

    //Customer Update
    if (btnTxt === 'Update') {
        let custId = $('#floatingId').val();
        let custName = $('#floatingName').val();
        let custContact = $('#floatingContact').val();
        let custEmail = $('#floatingEmail').val();
        let custNIC = $('#floatingNIC').val();
        let custAddress = $('#floatingAddress').val();
        let custGender = $('#floatingGender').val();

        if (custId === "" || custName === "" || custContact === "" || custEmail === "" || custNIC === "" || custAddress === "" || custGender === "") {
            Swal.fire({
                title: "Enter data to All fields",
                icon: 'error'
            });
            return;
        }

        customer_db.forEach(function (customer) {
            if (customer.id === custId) {
                customer.cName = custName;
                customer.cContact = custContact;
                customer.cEmail = custEmail;
                customer.cNIC = custNIC;
                customer.cAddress = custAddress;
                customer.cGender = custGender;
            }
        });

    }
    clearFields();
    loadCustomers();
});

function loadCustomers(){
    $('#tableBody').empty();

    customer_db.map(function (customer) {
        let cId = customer.id;
        let cName = customer.cName;
        let cContact = customer.cContact;
        let cEmail = customer.cEmail;
        let cNIC = customer.cNIC;
        let cAddress = customer.cAddress;
        let cGender = customer.cGender;

        let data = `<tr>
                        <td>${cId}</td>
                        <td>${cName}</td>
                        <td>${cContact}</td>
                        <td>${cEmail}</td>
                        <td>${cNIC}</td>
                        <td>${cAddress}</td>
                        <td>${cGender}</td>
                        <td><img src="../assets/icon/icons8-delete-90.png" width="35px" height="35px" id="delete"></td>
                        
                    </tr>`

        $('#tableBody').append(data);
    })
}
$('#tableBody').on('click', 'tr',function (event) {
    if ($(event.target).closest('#delete').length > 0) {
        return;
    }

    const customer_index = $(this).index();
    const selected_customer = customer_db[customer_index];

    $('#floatingId').val(selected_customer.id);
    $('#floatingName').val(selected_customer.cName);
    $('#floatingContact').val(selected_customer.cContact);
    $('#floatingEmail').val(selected_customer.cEmail);
    $('#floatingNIC').val(selected_customer.cNIC);
    $('#floatingAddress').val(selected_customer.cAddress);
    $('#floatingGender').val(selected_customer.cGender);
    $('#BtnSubmit').text('Update');
    $('#BtnReset').text('Cancel');

    $('#floatingId').prop('disabled', true);
});

$('tableBody').on('click', 'tr', function (event) {
    const customer_index = $(this).index();
    customer_db.splice(customer_index, 1);
    loadCustomers();
});