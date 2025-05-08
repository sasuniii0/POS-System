import CustomerModel from "../model/customerModel.js";
import {customer_db} from "../db/db.js";

//load customer records
function loadCustomers(){
    $('#tableBody').empty();
    customer_db.map((customer, index) => {
        let name = customer.name;
        let contact = customer.contactNumber;
        let email = customer.email;
        let nic = customer.nic;
        let address = customer.address;

        let data = `<tr>
                            <td>${index +1 }</td>
                            <td>${name}</td>
                            <td>${contact}</td>
                            <td>${email}</td>
                            <td>${nic}</td>
                            <td>${address}</td>
        </tr>`
        $('#tableBody').append(data);
    })
}
//save
$('#BtnSubmit').on('click', function(){
    let name = $('#floatingName').val();
    let contact = $('#floatingContact').val();
    let email = $('#floatingEmail').val();
    let nic = $('#floatingNic').val();
    let address = $('#floatingAddress').val();

    if (name ==="" || contact === "" || email === "" || nic === "" || address === "" ) {
        Swal.fire({
            title: 'Error!',
            text: 'Invalid Inputs',
            icon: 'error',
            confirmButtonText: 'Ok'
        })
    } else{
        let customer_data = new CustomerModel(name,contact,email,nic,address);
        customer_db.push(customer_data);
        console.log(customer_db);
        loadCustomers();

        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            timer: 1500,
            draggable:true
        })
    }
})

$('#tableBody').on('click', function(){
    let indx = $(this).index();
    let obj = customer_db[indx];
    console.log(obj);

    let name = obj.name;
    let contact = obj.contactNumber;
    let email = obj.email;
    let nic = obj.nic;
    let address = obj.address;

    $('#floatingName').val(name);
    $('#floatingContact').val(contact);
    $('#floatingEmail').val(email);
    $('#floatingNic').val(nic);
    $('#floatingAddress').val(address);
})







/*
// Initialize when page loads
$(document).ready(function() {
    loadCustomers();

    // Form submission handler
    $('#customerForm').on('submit', function(e) {
        e.preventDefault();
        handleCustomerSubmit();
    });

    // Reset button handler
    $('#BtnReset').on('click', function() {
        clearFields();
    });

    // Delete button handler
    $('#tableBody').on('click', '.delete-btn', function(e) {
        e.stopPropagation();
        const index = $(this).closest('tr').index();
        customer_db.splice(index, 1);
        loadCustomers();
        Swal.fire("Deleted!", "Customer removed successfully", "success");
    });

    // Row click handler for editing
    $('#tableBody').on('click', 'tr', function() {
        if ($(event.target).hasClass('delete-btn')) return;

        const index = $(this).index();
        const customer = customer_db[index];

        $('#floatingId').val(customer.id).prop('disabled', true);
        $('#floatingName').val(customer.name);
        $('#floatingContact').val(customer.contactNumber);
        $('#floatingEmail').val(customer.email);
        $('#floatingNic').val(customer.nic);
        $('#floatingAddress').val(customer.address);
        $(`input[name="user_gender"][value="${customer.gender.toLowerCase()}"]`).prop('checked', true);
        $('#BtnSubmit').text('Update');
        $('#BtnReset').text('Cancel');
    });
});

function handleCustomerSubmit() {
    let btnTxt = $('#BtnSubmit').text();

    if (btnTxt === 'Submit') {
        // Get all form values
        let custId = $('#floatingId').val().trim();
        let custName = $('#floatingName').val().trim();
        let custContact = $('#floatingContact').val().trim();
        let custEmail = $('#floatingEmail').val().trim();
        let custNIC = $('#floatingNic').val().trim();
        let custAddress = $('#floatingAddress').val().trim();
        let custGender = $('input[name="user_gender"]:checked').val();

        // Validate inputs
        if (!custId || !custName || !custContact || !custEmail || !custNIC || !custAddress) {
            Swal.fire("Error", "Please fill all fields", "error");
            return;
        }

        // Validate email format
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(custEmail)) {
            Swal.fire("Error", "Please enter a valid email", "error");
            return;
        }

        // Check for duplicate ID
        if (customer_db.some(c => c.id === custId)) {
            Swal.fire("Error", "Customer ID already exists", "error");
            return;
        }

        // Add new customer
        customer_db.push(new CustomerModel(
            custId, custName, custContact, custEmail, custNIC, custAddress, custGender
        ));

        Swal.fire({
            title: "Success!",
            text: "Customer saved successfully",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
        });

        clearFields();
        loadCustomers();
    }
    else if (btnTxt === 'Update') {
        // Update existing customer
        let custId = $('#floatingId').val();
        let custName = $('#floatingName').val().trim();
        let custContact = $('#floatingContact').val().trim();
        let custEmail = $('#floatingEmail').val().trim();
        let custNIC = $('#floatingNic').val().trim();
        let custAddress = $('#floatingAddress').val().trim();
        let custGender = $('input[name="user_gender"]:checked').val();

        // Validate inputs
        if (!custName || !custContact || !custEmail || !custNIC || !custAddress) {
            Swal.fire("Error", "Please fill all fields", "error");
            return;
        }

        // Find and update customer
        let customerIndex = customer_db.findIndex(c => c.id === custId);
        if (customerIndex !== -1) {
            customer_db[customerIndex] = new CustomerModel(
                custId, custName, custContact, custEmail, custNIC, custAddress, custGender
            );

            Swal.fire({
                title: "Updated!",
                text: "Customer updated successfully",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });

            clearFields();
            loadCustomers();
        }
    }
}

function loadCustomers() {
    $('#tableBody').empty();

    if (customer_db.length === 0) {
        $('#tableBody').append(`
            <tr>
                <td colspan="8" class="text-center text-muted">No customers found</td>
            </tr>
        `);
        return;
    }

    customer_db.forEach(customer => {
        $('#tableBody').append(`
            <tr>
                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.address}</td>
                <td>${customer.nic}</td>
                <td>${customer.contactNumber}</td>
                <td>${customer.gender}</td>
                <td>
                    <img src="../assets/icon/icons8-delete-90.png" 
                         width="35px" height="35px" class="delete-btn" title="Delete">
                </td>
            </tr>
        `);
    });
}

function clearFields() {
    $('#floatingId').val("").prop('disabled', false);
    $('#floatingName').val("");
    $('#floatingContact').val("");
    $('#floatingEmail').val("");
    $('#floatingNic').val("");
    $('#floatingAddress').val("");
    $('#genderMale').prop('checked', true);
    $('#BtnSubmit').text('Submit');
    $('#BtnReset').text('Reset');
}*/
