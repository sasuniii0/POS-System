export default class OrderModel{
    constructor(customerName,itemName, price, quantityOnHand, pic) {
        this.customerName = customerName;
        this.itemName = itemName;
        this.price = price;
        this.quantityOnHand = quantityOnHand;
        this.pic = pic;
    }
}