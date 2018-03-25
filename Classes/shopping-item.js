angular.module("app").factory("ShoppingItem", function (AWSService, Activity, UserDataService) {
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
            var activityData;
            var d = new Date();
            if (pickedUp) {
                activityData = UserDataService.name + " picked up an item."
                let activity = new Activity({
                    id: Date.now(),
                    data: activityData,
                    date: d.toDateString()
                });
                activity.logActivity();
            }
        }
    }

    return ShoppingItem;
});
