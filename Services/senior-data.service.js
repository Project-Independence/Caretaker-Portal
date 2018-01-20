angular.module("app").service("SeniorDataService", function (AWSService, RideRequest, ShoppingList, ShoppingItem) {
    class SeniorDataService {
        constructor() {
            this.shoppingList = {};
            this.rideRequests = {};
            this.init();
        }

        init() {
            AWSService.getRideRequests((err, data) => {
                if (err) {
                    console.log(err);
                } else if (data) {
                    let requests = [];
                    data.forEach((item) => {
                        let request = new RideRequest({
                            claimed: item.claimed,
                            date: item.date,
                            event: item.event,
                            id: item.id,
                            time: item.time
                        });
                        requests.push(request);
                    })
                    this.rideRequests = requests;
                }
            });

            AWSService.getShoppingList((err, data) => {
                if (err) {
                    console.log(err);
                } else if (data) {
                    let shoppingList = new ShoppingList();
                    data.forEach((item) => {
                        let shoppingItem = new ShoppingItem({
                            name: item.item,
                            timestamp: item.timestamp,
                            quantity: item.quantity,
                            pickedUp: item.done

                        });
                        shoppingList.addItem(shoppingItem);
                    });
                    this.shoppingList = shoppingList;
                }
            });
        }


    }
    let srv = new SeniorDataService();
    return srv;
});
