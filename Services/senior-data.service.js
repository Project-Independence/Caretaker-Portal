angular.module("app").service("SeniorDataService", function (AWSService) {
    class SeniorDataService {
        constructor() {
            this.shoppingList = {};
            this.rideRequests = {};
            this.init();
        }

        init() {
            AWSService.getShoppingList((err, data) => {
                if (err) {
                    console.log(err);
                } else if (data) {
                    this.shoppingList = data;
                }
            });

            AWSService.getRideRequests((err, data) => {
                if (err) {
                    console.log(err);
                } else if (data) {
                    this.rideRequests = data;
                }
            });
        }


    }
    let srv = new SeniorDataService();
    return srv;
});
