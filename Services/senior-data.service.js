angular.module("app").service("SeniorDataService", function (AWSService, RideRequest, ShoppingList, ShoppingItem, Activity, UserDataService) {
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

            let days = ['Sun', 'Mon', 'Tues', 'Weds', 'Thurs', 'Fri', 'Sat']

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
                            timestamp: item.timestamp

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


    }
    let srv = new SeniorDataService();
    return srv;
});
