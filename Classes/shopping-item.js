angular.module("app").factory("ShoppingItem", function (AWSService) {
    class ShoppingItem {
        constructor(descriptor) {
            this.timestamp = descriptor.timestamp;
            this.name = descriptor.name;
            this.quantity = descriptor.quantity;
            this.urgency = descriptor.urgency;
            this.pickedUp = descriptor.pickedUp;
        }

        togglePickup(pickedUp) {
            AWSService.togglePickup(this, pickedUp);
        }
    }

    return ShoppingItem;
});
