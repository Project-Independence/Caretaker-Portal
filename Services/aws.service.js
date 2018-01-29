angular.module("app").service("AWSService", function () {
    class AWSService {
        constructor() {
            this.initAWS();
            this.documentClient = new AWS.DynamoDB.DocumentClient();
            this.sns = new AWS.SNS();

            this.previousTimestamp = null;
        }

        initAWS() {
            AWS.config.region = 'us-east-1';
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'us-east-1:b2600055-0fc7-4bb3-9bd0-6ba8fa16fd4f'
            });
        }

        getRideRequests(callbackFn) {
            let params = {
                TableName: 'Rides'
            };
            this.documentClient.scan(params, (err, data) => {
                if (err) {
                    callbackFn(err, null);
                } else {
                    callbackFn(err, data.Items);
                }
            });
        }

        getShoppingList(callbackFn) {
            var params = {
                TableName: 'Shopping'
            };
            this.documentClient.scan(params, (err, data) => {
                if (err) {
                    callbackFn(err, null);
                } else {
                    callbackFn(err, data.Items);
                }
            });
        }

        getActivities(callbackFn) {
            var params = {
                TableName: 'Activity'
            };
            this.documentClient.scan(params, (err, data) => {
                if (err) {
                    callbackFn(err, null);
                } else {
                    callbackFn(err, data.Items);
                }
            });
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

        toggleClaim(request, claim) {
            if (claim) {
                //                const subject = "Ride Confirmation";
                //                const body = "You picked up a ride for '" + this.event + "' on: " + this.date + " at " + this.time + ". We will send you another reminder prior to the pickup time.";
                //                this.sendEmail(subject, body);
            }
            var params = {
                Key: {
                    id: request.id
                },
                AttributeUpdates: {
                    claimed: {
                        Action: 'PUT',
                        Value: claim
                    },
                },
                TableName: 'Rides'
            }
            this.documentClient.update(params, function (err, data) {});
        }

        togglePickup(item, pickup) {
            var params = {
                Key: {
                    item: item.name
                },
                AttributeUpdates: {
                    done: {
                        Action: 'PUT',
                        Value: item.pickedUp
                    },
                },
                TableName: 'Shopping'
            }
            this.documentClient.update(params, function (err, data) {});
        }

        getChangeStatus(callbackFn) {
            var params = {
                TableName: 'UIData',
                Key: {
                    id: 'lastChange'
                }

            };
            this.documentClient.get(params, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    if (data.Item.time != this.previousTimestamp) {
                        this.previousTimestamp = data.Item.time;
                        callbackFn(true);
                    } else {
                        callbackFn(false);
                    }
                }
            });
        }
    }
    let srv = new AWSService();
    return srv;
});
