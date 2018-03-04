angular.module("app").factory("RideRequest", function (AWSService, Activity) {
    class RideRequest {
        constructor(descriptor) {
            //this.rideID = descriptor.rideID;
            //this.clientID = descriptor.clientID;
            //this.dest = descriptor.dest;
            //this.arrivalTime = descriptor.arrivalTime;
            //this.pickupTime = descriptor.pickupTime;
            //this.driverID = descriptor.driverID;

            this.claimed = descriptor.claimed; // deprec
            this.date = descriptor.date;
            this.event = descriptor.event; // deprec
            this.id = descriptor.id; // will be rideID ^
            this.time = descriptor.time; // deprec (to arrival/pickup)
        }

        toggleClaim(claim) {
            AWSService.toggleClaim(this, claim);
            var activityData;
            var d = new Date();
            if (claim) {
                activityData = "Caretaker claimed a ride."
            } else {
                activityData = "Caretaker unclaimed a ride."
            }
            let activity = new Activity({
                id: Date.now(),
                data: activityData,
                date: d.toDateString()
            });
            activity.logActivity();
        }

        cancel() {}


    }

    return RideRequest;
});
