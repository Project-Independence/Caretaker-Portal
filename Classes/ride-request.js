angular.module(`app`).factory(`RideRequest`, function (AWSService, Activity, UserDataService) {
    // ---RideRequest Class---
    // object representation of a ride request by the senior 
    class RideRequest {
        constructor(descriptor) {
            this.claimed = descriptor.claimed;
            this.date = descriptor.date;
            this.event = descriptor.event;
            this.id = descriptor.id;
            this.time = descriptor.time;
            this.driverName = descriptor.driverName;
            this.timestamp = descriptor.timestamp;
        }

        // toggled "claimed" status of ride and update database
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
                logString: activityData,
                date: d.toDateString(),
                type: claim ? 'ride-claim' : 'ride-unclaim',
                data: {
                    type: claim ? 'ride-claim' : 'ride-unclaim',
                    name: this.event,
                    pickupTime: this.time,
                    CaretakerName: UserDataService.name,
                    CaretakerID: UserDataService.UserID,
                    date: this.date
                }
            });
            activity.logActivity();
        }


    }

    return RideRequest;
});
