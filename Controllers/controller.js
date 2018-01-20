angular.module("app").controller("MainController",
    class MainController {
        constructor(AWSService, $mdDialog, SeniorDataService) {
            this.AWSService = AWSService;
            this.events = [];
            this.shoppingItems = [];
            AWS.config.region = 'us-east-1';
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'us-east-1:b2600055-0fc7-4bb3-9bd0-6ba8fa16fd4f'
            });
            this.documentClient = new AWS.DynamoDB.DocumentClient();
            this.sns = new AWS.SNS();
            setInterval(() => {
                this.getChangeStatus();
                // if (this.checkForChange()) {
                this.populateRidesList();
                this.populateShoppingList();
                this.populateErrands();
                //  }
            }, 500)


            this.status = '  ';
            this.customFullscreen = false;
        }

        toggleRide(ride) {
            if (ride.claimed) {
                const subject = "Ride Confirmation";
                const body = "You picked up a ride for '" + ride.event + "' on: " + ride.date + " at " + ride.time + ". We will send you another reminder prior to the pickup time.";
                this.sendEmail(subject, body);
            }
            this.recordChange();
            var params = {
                Key: {
                    id: ride.id
                },
                AttributeUpdates: {
                    claimed: {
                        Action: 'PUT',
                        Value: ride.claimed
                    },
                },
                TableName: 'Rides'
            }
            this.documentClient.update(params, function (err, data) {});
        }

        showConfirm(ride) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Unclaim this ride?')
                .textContent('Ride is for: ' + ride.event)
                .ariaLabel('Lucky day')
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(() => {}, () => {
                ride.claimed = true;
                this.toggleRide(ride, false);
            });
        };

        showConfirmPickup(ride) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Claim this ride?')
                .textContent('Ride is for: ' + ride.event)
                .ariaLabel('Lucky day')
                .ok('Yes')
                .cancel('No');

            $mdDialog.show(confirm).then(() => {
                ride.claimed = !ride.claimed;
                this.toggleRide(ride, false);
            }, () => {
                this.toggleRide(ride, false);
            });
        };


        toggleShoppingItem(item) {
            this.recordChange();
            var params = {
                Key: {
                    item: item.item
                },
                AttributeUpdates: {
                    done: {
                        Action: 'PUT',
                        Value: item.done
                    },
                },
                TableName: 'Shopping'
            }
            this.documentClient.update(params, function (err, data) {});
        }


        populateShoppingList() {
            var params = {
                TableName: 'Shopping'
            };
            this.documentClient.scan(params, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    this.shoppingItems = data.Items.sort(function (a, b) {
                        var keyA = a.timestamp,
                            keyB = b.timestamp;
                        // Compare the 2 dates
                        if (keyA > keyB) return -1;
                        if (keyA < keyB) return 1;
                        return 0;
                    });
                }
            });
        }

        populateErrands() {
            var params = {
                TableName: 'Errands'
            };
            this.documentClient.scan(params, (err, data) => {
                if (err) {
                    console.log(err);
                } else if (!_.isEqual(this.errands, data.Items)) {
                    this.errands = data.Items.sort(function (a, b) {
                        var keyA = a.timestamp,
                            keyB = b.timestamp;
                        // Compare the 2 dates
                        if (keyA > keyB) return -1;
                        if (keyA < keyB) return 1;
                        return 0;
                    });
                }
            });
        }

        populateRidesList() {
            var params = {
                TableName: 'Rides'
            };
            this.documentClient.scan(params, (err, data) => {
                if (err) {
                    console.log(err);
                } else if (!_.isEqual(this.events, data.Items)) {
                    this.events = data.Items.sort(function (a, b) {
                        var keyA = new Date(a.date),
                            keyB = new Date(b.date);
                        // Compare the 2 dates
                        if (keyA < keyB) return -1;
                        if (keyA > keyB) return 1;
                        return 0;
                    });
                }
            });
        }

        getChangeStatus() {
            var params = {
                TableName: 'UIData',
                Key: {
                    id: 'lastChange'
                }

            };
            this.documentClient.get(params, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    this.tempChange = data.Item.time;
                }
            });
        }

        tcheckForChange() {
            if (this.tempChange != this.lastChange) {
                this.lastChange = this.tempChange;
                return true;
            } else {
                return false;
            }
        }

        recordChange() {
            var params = {
                Key: {
                    id: "lastChange"
                },
                AttributeUpdates: {
                    time: {
                        Action: 'PUT',
                        Value: Date.now()
                    },
                },
                TableName: 'UIData'
            }
            this.documentClient.update(params, function (err, data) {});
        }

        showAdvanced() {
            $mdDialog.show({
                    templateUrl: 'login-screen.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose: true,
                    fullscreen: this.customFullscreen // Only for -xs, -sm breakpoints.
                })
                .then((answer) => {
                    this.status = 'You said the information was "' + answer + '".';
                }, () => {
                    this.status = 'You cancelled the dialog.';
                });
        };

        sendEmail(subject, body) {
            var params = {
                Message: body,
                Subject: subject,
                TopicArn: 'arn:aws:sns:us-east-1:112632085303:CaretakerPortal'
            };
            this.sns.publish(params, function (err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else console.log(data); // successful response
            });
        }
    });
