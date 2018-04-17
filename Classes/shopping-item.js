angular.module("app").factory("ShoppingItem", function (AWSService, Activity, UserDataService) {
    class ShoppingItem {
        constructor(descriptor) {
            this.timestamp = descriptor.timestamp;
            this.name = descriptor.name;
            this.quantity = descriptor.quantity;
            this.urgency = descriptor.urgency;
            this.pickedUp = descriptor.pickedUp;
        }

        togglePickup(pickedUp, callbackFn) {
            AWSService.togglePickup(this, pickedUp, () => {
                callbackFn();
            });
            var activityData;
            var d = new Date();
            if (pickedUp) {
                activityData = UserDataService.name + " picked up " + this.name + " for Bertha."
                let activity = new Activity({
                    id: Date.now(),
                    logString: activityData,
                    date: d.toDateString(),
                    type: 'shopping-pickup',
                    data: {
                        type: 'shopping-pickup',
                        name: this.name,
                        CaretakerName: UserDataService.name,
                        CaretakerID: UserDataService.UserID
                    }

                });
                activity.logActivity();
            }
            this.pickedUp = pickedUp;
        }
    }

    return ShoppingItem;
});
