angular.module("app").service("SeniorDataService", function (AWSService, RideRequest, ShoppingList, ShoppingItem, Activity, UserDataService) {
    // --- SeniorDataService ---
    // Stores user data to be accessed from other services and classes
    class SeniorDataService {
        constructor() {
            this.shoppingList = {};
            this.rideRequests = {};
            this.activities = {};
            this.init();
            this.changePending = false;
            this.previousTimeStamp = null;

            setInterval(() => {
                AWSService.getChangeStatus((data) => {
                    if (data === true) {
                        this.init();
                        this.changePending = true;
                    }
                });
            }, 500)
        }

        // get the activities from database and make Activiy objects from each
        initActivities() {
            let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

            function format_time(date_obj) {
                // formats a javascript Date object into a 12h AM/PM time string
                var hour = date_obj.getHours();
                var minute = date_obj.getMinutes();
                var amPM = (hour > 11) ? "pm" : "am";
                if (hour > 12) {
                    hour -= 12;
                } else if (hour == 0) {
                    hour = "12";
                }
                if (minute < 10) {
                    minute = "0" + minute;
                }
                return hour + ":" + minute + amPM;
            }
            AWSService.getActivities((err, data) => {
                if (err) {
                    console.log(err);
                } else if (data) {
                    let activities = [];
                    data.forEach((item) => {
                        let timestamp = item.timestamp;
                        let dateObj = new Date(timestamp);
                        let dayStr = days[dateObj.getDay()];
                        let timeStr = format_time(dateObj);
                        let finalStr = dayStr + ' ' + timeStr;

                        let activity = new Activity({
                            id: item.ActivityID,
                            data: item.data,
                            //caretakerID: item.CaretakerID,
                            date: finalStr,
                            timestamp: item.timestamp,
                            logString: item.logString

                        });
                        activities.push(activity);
                    });
                    activities.sort(function (a, b) {
                        var keyA = a.timestamp,
                            keyB = b.timestamp;
                        // Compare the 2 dates
                        if (keyA < keyB) return 1;
                        if (keyA > keyB) return -1;
                        return 0;
                    });
                    this.activities = activities;

                }
            });
        }

        // get ride requests, activites, and shopping list
        // store all in this service to be used by other services
        init() {
            this.initActivities();
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
                            driverName: item.driverName,
                            timestamp: item.timestamp
                        });
                        requests.push(request);
                    })
                    requests.sort(function (a, b) {
                        var keyA = a.timestamp,
                            keyB = b.timestamp;
                        // Compare the 2 dates
                        if (keyA < keyB) return 1;
                        if (keyA > keyB) return -1;
                        return 0;
                    });
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
                    shoppingList.list.sort(function (a, b) {
                        var keyA = a.timestamp,
                            keyB = b.timestamp;
                        // Compare the 2 dates
                        if (keyA > keyB) return 1;
                        if (keyA < keyB) return -1;
                        return 0;
                    });
                    this.shoppingList = shoppingList;
                }
            });
        }


    }
    let srv = new SeniorDataService();
    return srv;
});
