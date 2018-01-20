angular.module("app").factory("ShoppingItem", function () {
    class ShoppingItem {
        constructor(descriptor) {
            this.timestamp = descriptor.timestamp;
            this.name = descriptor.name;
            this.quantity = descriptor.quantity;
            this.urgency = descriptor.urgency;
        }
    }

    return ShoppingItem;
});
