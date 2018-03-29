angular.module("app").service("SeniorDataService", function (AWSService, RideRequest, ShoppingList, ShoppingItem, Activity, ListService, UserDataService) {
    class SeniorDataService {
        constructor() {
            this.shoppingList = {};
            this.rideRequests = {};
            this.activities = {};
            this.init();
            this.changePending = false;
            this.previousTimeStamp = null;
            this.listService = ListService;

            setInterval(() => {
                AWSService.getChangeStatus((data) => {
                    if (data === true) {
                        this.init();
                        this.changePending = true;
                    }
                });
            }, 500)
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
                            time: item.time,
                            driverName: item.driverName
                        });
                        requests.push(request);
                    })
                    requests.sort(function (a, b) {
                        var keyA = new Date(a.date),
                            keyB = new Date(b.date);
                        // Compare the 2 dates
                        if (keyA < keyB) return 1;
                        if (keyA > keyB) return -1;
                        return 0;
                    });
                    this.rideRequests = requests;
                    this.listService.loadRides(requests);
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
                    shoppingList.list.sort(function (a, b) {
                        var keyA = a.timestamp,
                            keyB = b.timestamp;
                        // Compare the 2 dates
                        if (keyA < keyB) return 1;
                        if (keyA > keyB) return -1;
                        return 0;
                    });
                    this.shoppingList = shoppingList;
                    this.listService.loadShoppingItems(shoppingList.list);
                }
            });

            AWSService.getActivities((err, data) => {
                if (err) {
                    console.log(err);
                } else if (data) {
                    let activities = [];
                    data.forEach((item) => {
                        let activity = new Activity({
                            id: item.ActivityID,
                            data: item.data,
                            //caretakerID: item.CaretakerID,
                            date: item.date,
                            //time: item.Time

                        });
                        activities.push(activity);
                    });
                    this.activities = activities;

                }
            });
        }


    }
    let srv = new SeniorDataService();
    return srv;
});
