export default class OrderModel {
    constructor(customerId,itemId,name,quantityOnHand,price) {
        this.customerId = customerId;
        this.itemId = itemId;
        this.name=name;
        this.quantityOnHand = quantityOnHand;
        this.price = price;
    }
}