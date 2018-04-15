angular.module(`app`).factory(`RideRequest`, function (AWSService, Activity, UserDataService) {
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
            this.driverName = descriptor.driverName;
        }

        toggleClaim(claim) {
            this.claimed = claim;
            if (claim) this.driverName = UserDataService.name;
            AWSService.toggleClaim(this, claim);
            var activityData;
            var d = new Date();
            if (claim) {
                activityData = UserDataService.name + ` claimed Bertha's ride to "` + this.event + `" for ` + this.date + ` at ` + this.time + `.`
            } else {
                activityData = UserDataService.name + ` unclaimed Bertha's ride to "` + this.event + `" for ` + this.date + ` at ` + this.time + `.`
            }
            let activity = new Activity({
                id: Date.now(),
                data: activityData,
                date: d.toDateString(),
                type: claim ? 'ride-claim' : 'ride-unclaim'
            });
            activity.logActivity();
        }

        cancel() {}


    }

    return RideRequest;
});
