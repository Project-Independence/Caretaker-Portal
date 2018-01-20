angular.module("app").factory("RideRequest", function () {
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

        claim() {}

        cancel() {}


    }

    return RideRequest;
});
