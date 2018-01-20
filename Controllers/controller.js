angular.module("app").controller("MainController",
    class MainController {
        constructor(AWSService, $mdDialog, SeniorDataService) {
            this.AWSService = AWSService;

            this.sns = new AWS.SNS();

            this.seniorDataService = SeniorDataService;
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
