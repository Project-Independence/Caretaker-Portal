angular.module("app").service("AWSService", function (UserDataService) {
    // --- AWSService ---
    // Service that handles all interaction with AWS services (DynamoDB, Cognito)
    class AWSService {
        constructor() {
            this.initAWS();
            this.documentClient = new AWS.DynamoDB.DocumentClient();
            this.sns = new AWS.SNS();
            this.cognito = new AWS.CognitoIdentityServiceProvider();
            this.previousTimestamp = null;
            this.userDataService = UserDataService;
        }

        // get firebase token used for recieving notifications
        getFirebaseToken() {
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
            let _this = this;
            messaging.requestPermission()
                .then(function () {
                    console.log("got permission");
                    return messaging.getToken();
                })
                .then(function (token) {
                    //_this.storeToken(token);
                    console.log(token);

                })
                .catch(function (err) {
                    console.log("error occured");
                });

            messaging.onMessage(function (payload) {
                console.log(payload);
            });
        }

        // store the token in database for alexa skill and other caretakers to use to send notifcations to 
        storeToken(token) {
            var params = {
                Key: {
                    UserID: UserDataService.UserID
                },
                AttributeUpdates: {
                    FirebaseToken: {
                        Action: 'PUT',
                        Value: token
                    },
                },
                TableName: 'Caretaker'
            }
            this.documentClient.update(params, function (err, data) {});
        }

        // set configuration of AWS (region, poolID, clientID)
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

        // create a new account in cognito based on username, password, email
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

        // authenticate user through cognito
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
                onSuccess: (result) => {
                    callbackFn(true);
                },

                onFailure: (err) => {
                    callbackFn(false);
                    alert(err);
                },
                newPasswordRequired: function () {
                    console.log("new pass");
                    cognitoUser.changePassword('Guitar648', '!Guitar648', function (err, result) {
                        if (err) {
                            alert(err);
                            return;
                        }
                        console.log('call result: ' + result);
                    });
                }

            });

        }

        // add an attribute to cognito profile (such as first name, id, profession, etc.)
        addUserAttribute(field, value) {
            var attributeList = [];
            var attribute = {
                Name: field,
                Value: value
            };
            var attribute = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(attribute);
            attributeList.push(attribute);

            this.user.updateAttributes(attributeList, function (err, result) {
                if (err) {
                    alert(err);
                    return;
                }
                console.log('call result: ' + result);
            });
        }

        // get ride requests from database
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

        // get messages from database
        getMessages(callbackFn) {
            let params = {
                TableName: 'Message'
            };
            this.documentClient.scan(params, (err, data) => {
                if (err) {
                    callbackFn(err, null);
                } else {
                    callbackFn(err, data.Items);
                }
            });
        }

        // get shopping list from database
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

        // get activites from database
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

        // log a change (used for updating the UI lists)
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

        // claim or unclaim ride and update in database
        toggleClaim(request, claim) {
            var params = {
                Key: {
                    id: request.id
                },
                AttributeUpdates: {
                    claimed: {
                        Action: 'PUT',
                        Value: claim
                    },
                    driverName: {
                        Action: 'PUT',
                        Value: claim ? this.userDataService.name : 'N/A'
                    },
                },
                TableName: 'Rides'
            }
            this.documentClient.update(params, (err, data) => {
                this.recordChange();
            });
        }

        // pickup or un-pickup 
        togglePickup(item, pickedUp, callbackFn) {
            console.log(item.name + ' now ' + pickedUp);
            var params = {
                Key: {
                    item: item.name
                },
                AttributeUpdates: {
                    done: {
                        Action: 'PUT',
                        Value: pickedUp
                    },
                    caretakerName: {
                        Action: 'PUT',
                        Value: pickedUp ? this.userDataService.name : 'N/A'
                    },
                },
                TableName: 'Shopping'
            }
            this.documentClient.update(params, (err, data) => {
                this.recordChange();
                callbackFn(data);
            });
        }

        // log an activity in database
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
                    timestamp: {
                        Action: 'PUT',
                        Value: Date.now()
                    },
                    type: {
                        Action: 'PUT',
                        Value: activity.type
                    },
                    logString: {
                        Action: 'PUT',
                        Value: activity.logString
                    }
                },
                TableName: 'Activity'
            }
            this.documentClient.update(params, function (err, data) {});
        }

        // add message to database
        sendMessage(message, callbackFn) {
            var params = {
                Key: {
                    MessageID: Date.now().toString()
                },
                AttributeUpdates: {
                    timestamp: {
                        Action: 'PUT',
                        Value: Date.now()
                    },
                    UserID: {
                        Action: 'PUT',
                        Value: 1
                    },
                    Message: {
                        Action: 'PUT',
                        Value: message
                    },
                    CaretakerID: {
                        Action: 'PUT',
                        Value: UserDataService.UserID
                    },
                    CaretakerName: {
                        Action: 'PUT',
                        Value: UserDataService.name
                    }

                },
                TableName: 'Message'
            }
            this.documentClient.update(params, function (err, data) {
                callbackFn(err, data);
            });
        }

        // get last change timestamp from database
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
