angular.module("app").service("AWSService", function () {
    class AWSService {
        constructor() {
            this.initAWS();
            this.documentClient = new AWS.DynamoDB.DocumentClient();
            this.sns = new AWS.SNS();
            this.cognito = new AWS.CognitoIdentityServiceProvider();
            this.previousTimestamp = null;

            var config = {
                apiKey: "AIzaSyALjVa5DXtXiZFhSHddwO-8_wVx7JyUuEQ",
                authDomain: "project-independence-1909b.firebaseapp.com",
                databaseURL: "https://project-independence-1909b.firebaseio.com",
                projectId: "project-independence-1909b",
                storageBucket: "project-independence-1909b.appspot.com",
                messagingSenderId: "425223397877"
            };
            firebase.initializeApp(config);
            const messaging = firebase.messaging();
            messaging.requestPermission()
                .then(function () {
                    console.log("got permission");
                    return messaging.getToken();
                })
                .then(function (token) {
                    console.log(token);
                })
                .catch(function (err) {
                    console.log("error occured");
                });

            messaging.onMessage(function (payload) {
                console.log(payload);
            });








        }
        initAWS() {
            AWS.config.update({
                region: 'us-east-1'
            });
            AWSCognito.config.region = 'us-east-1';
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: 'us-east-1:b2600055-0fc7-4bb3-9bd0-6ba8fa16fd4f'
            });
            let poolData = {
                UserPoolId: 'us-east-1_GbIl2bvUD',
                ClientId: '1ctlarndvglpi4tdfb3v96796f'
            };
            this.userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

        }

        signup(username, password, email) {
            var attribute = {
                Name: 'email',
                Value: email
            };
            var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(attribute);
            var attributeList = [];

            attributeList.push(attributeEmail);
            var cognitoUser;

            this.userPool.signUp(username, password, attributeList, null, function (err, result) {
                if (err) {
                    alert(err);
                    return;
                }
                cognitoUser = result.user;
            });
        }

        login(username, password, callbackFn) {
            var authenticationData = {
                Username: username,
                Password: password,
            };
            var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
            var userData = {
                Username: username,
                Pool: this.userPool
            };
            var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: function (result) {
                    callbackFn(true);
                    //console.log('access token + ' + result.getAccessToken().getJwtToken());
                    //console.log('idToken + ' + result.idToken.jwtToken);
                },

                onFailure: function (err) {
                    callbackFn(false);
                    alert(err);
                },
                newPasswordRequired: function () {
                    cognitoUser.changePassword('!Guitar648', '?Guitar648', function (err, result) {
                        if (err) {
                            alert(err);
                            return;
                        }
                        console.log('call result: ' + result);
                    });
                }

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

        logActivity(activity) {
            var params = {
                Key: {
                    ActivityID: activity.id
                },
                AttributeUpdates: {
                    data: {
                        Action: 'PUT',
                        Value: activity.data
                    },
                    date: {
                        Action: 'PUT',
                        Value: activity.date
                    },
                },
                TableName: 'Activity'
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
