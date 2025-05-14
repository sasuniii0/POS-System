export let customer_db = [];
export let item_db = [];
export let order_db = [];






/*




<script>
    // Sample items array (can be fetched from backend too)
    let items = [];
    let orders_db = [];

    $(document).ready(function () {

    $("#search_item_input").prop("disabled", true);
    $("#search_item_btn").prop("disabled", true);
    $("#search_customer_input").prop("disabled", true);
    $("#search_customer_btn").prop("disabled", true);
    $("#finalize-order-place-btn").prop("disabled", true);
    $(".card-body").css("pointer-events", "none").css("opacity", "0.6");

    items = [
{ name: "Toffee", price: 15.00, qoh: 20 },
{ name: "Cake", price: 1200.00, qoh: 5 },
{ name: "Chocolate", price: 160.00, qoh: 50 },
{ name: "Lollipop", price: 10.00, qoh: 100 },
{ name: "Biscuit", price: 100.00, qoh: 40 },
{ name: "Marshmallows", price: 150.00, qoh: 80 }
    ];
    renderItems();
});

    function renderItems(filter = "") {
    const container = $("#item_tbody");
    container.empty();

    $.each(items.filter(item => item.name.toLowerCase().includes(filter.toLowerCase())), function (index, item) {
    const card = `
                    <div class="col-6 col-md-6 mb-3">
                        <div class="card h-100 bg-light text-dark shadow-sm">
                            <div class="card-body d-flex flex-column justify-content-between">
                                <div class="text-start">
                                    <h6 class="card-title mb-1">${item.name}</h6>
                                    <p class="card-text mb-2">Rs. ${item.price.toFixed(2)}</p>
                                </div>
                                <div class="text-end mt-auto">
                                    <button class="btn btn-dark btn-sm add_to_cart_btn" data-index="${index}">
                                        <i class="ti ti-shopping-cart"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
    container.append(card);
});
}

    //renderItems();

    // Search filter (live typing)
    $("#search_item_input").on("keyup", function () {
    renderItems($(this).val());
});

    // Search button
    $("#search_item_btn").on("click", function (e) {
    e.preventDefault();
    renderItems($("#search_item_input").val());
});


    //  get Customer list
    const customerList = [
    { id: "C001", name: "John" },
    { id: "C002", name: "Mary" },
    { id: "C003", name: "Nimal" },
    { id: "C004", name: "Jeeva" },
    { id: "C005", name: "Priya" },
    { id: "C006", name: "Akshay" }
    ];
    const datalist_customers = $("#customerDatalistOptions");

    $(document).ready(function () {
    $.each(customerList, function (index, customer) {
        let customerOption = `<option value="${customer.name}">`;
        datalist_customers.append(customerOption);
    });
});

    // add items to cart
    $(document).on("click", ".add_to_cart_btn", function () {
    const index = $(this).data("index");
    const item = items[index];
    let count = 1;
    let itemTotalAmount = item.price * count;
    const cartCard = `
                    <div class="col-12 col-md-12 mb-3">
                        <div class="card h-100 bg-light text-dark shadow-sm">
                            <div class="card-body d-flex flex-column justify-content-between">
                                <div class="text-start">
                                    <h6 class="card-title mb-1">${item.name} x <span class="item-cart-count">${count}</span></h6>
                                    <p class="card-text mb-2 item-total">Rs. ${item.price.toFixed(2)} x <span class="item-cart-count">${count}</span> = <span class="item-total-amount">${itemTotalAmount.toFixed(2)}</span></p>
                                    <button class="btn btn-outline-dark rounded-circle btn-dark text-white btn-sm me-1 increaseCount" style="width: 20px; height: 20px; padding: 0;"><i class="ti ti-plus"></i></button><span class="item-cart-count">${count}</span>
                                    <button class="btn btn-outline-dark rounded-circle btn-dark text-white btn-sm me-1 decreaseCount" style="width: 20px; height: 20px; padding: 0;"><i class="ti ti-minus"></i></button>
                                </div>
                                <div class="text-end mt-auto">
                                    <button class="btn btn-dark btn-sm remove_from_cart_btn"><i class="ti ti-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
    $("#item_cart").append(cartCard);
});

    $(document).on('click', ".increaseCount", function () {
    const cardBody = $(this).closest(".card-body");
    const countSpans = cardBody.find(".item-cart-count");
    const totalItemAmountText = cardBody.find(".item-total-amount");
    const item = cardBody.find(".card-title").text().split(" x ")[0].trim();
    const price = items.find(i => i.name === item).price;
    const itemData = items.find(i => i.name === item);

    let count = parseInt($(countSpans[0]).text());
    count++;

    // Check quantity limit
    if (count > itemData.qoh) {
    alert(`Only ${itemData.qoh} ${item}(s) available.`);
    return;
}

    countSpans.text(count);

    totalItemAmountText.text((price * count).toFixed(2));
});

    $(document).on('click', ".decreaseCount", function () {
    const cardBody = $(this).closest(".card-body");
    const countSpans = cardBody.find(".item-cart-count");
    const totalItemAmountText = cardBody.find(".item-total-amount");
    const item = cardBody.find(".card-title").text().split(" x ")[0].trim();
    const price = items.find(i => i.name === item).price;
    //const itemData = items.find(i => i.name === item);

    let count = parseInt($(countSpans[0]).text());
    count--;

    // Check quantity limit
    if (count < 1) {
    return;
}

    countSpans.text(count);

    totalItemAmountText.text((price * count).toFixed(2));
});

    $(document).on("click", ".remove_from_cart_btn", function () {
    $(this).closest(".col-6").remove();
});

    $(document).on("click", "#finalize-order-place-btn", function (e) {
    e.preventDefault();

    const customerName = $("#search_customer_input").val().trim();
    const customer = customerList.find(c => c.name === customerName);

    //if (!customerName || !customerList.includes(customerName)) {
    if (!customer) {
    Swal.fire({
    icon: 'error',
    title: 'Customer not selected!',
    text: 'Please select a valid customer before placing the order.',
});
    return;
}

    const cartItems = $("#item_cart").children(".col-12, .col-md-12");

    if (cartItems.length === 0) {
    Swal.fire({
    icon: 'warning',
    title: 'Cart is empty!',
    text: 'Please add items before placing the order.',
});
    return;
}

    // If cart is not empty
    Swal.fire({
    icon: 'success',
    title: 'Order placed!',
    text: 'Your order has been successfully submitted.',
    confirmButtonText: 'OK'
}).then(() => {
    const order = {
    orderId: $('#next_order_id').val(),
    customer: customer.id,
    items: []
};
    orders_db.push(order);
    $("#item_cart").empty();

    generateNextOrderId();
    $("#search_customer_input").val("");
    /!*$("#search_item_input").prop("disabled", true);
    $("#search_item_btn").prop("disabled", true);
    $("#search_customer_input").prop("disabled", true);
    $("#search_customer_btn").prop("disabled", true);
    $("#finalize-order-place-btn").prop("disabled", true);
    $(".card-body").css("pointer-events", "none").css("opacity", "0.6");*!/

});
});

    $(document).on("click", "#new_order_btn", function () {
    $("#search_item_input").prop("disabled", false);
    $("#search_item_btn").prop("disabled", false);
    $("#search_customer_input").prop("disabled", false);
    $("#search_customer_btn").prop("disabled", false);
    $("#finalize-order-place-btn").prop("disabled", false);
    $(".card-body").css("pointer-events", "auto").css("opacity", "1");

    generateNextOrderId();
});

    function generateNextOrderId() {
    const nextOrderId = 'O' + String(orders_db.length + 1).padStart(3, '0');
    $('#next_order_id').val(nextOrderId);
}

</script>*/
