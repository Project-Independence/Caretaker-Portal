angular.module("app").service("AWSService", function (RideRequest, ShoppingList, ShoppingItem) {
    class AWSService {
        constructor() {
            this.initAWS();
            this.documentClient = new AWS.DynamoDB.DocumentClient();
            this.sns = new AWS.SNS();
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
                    callbackFn(err);
                } else {
                    let requests = [];
                    data.Items.forEach((item) => {
                        let request = new RideRequest({
                            claimed: item.claimed,
                            date: item.date,
                            event: item.event,
                            id: item.id,
                            time: item.time
                        });
                        requests.push(request);
                    })
                    if (typeof callbackFn === 'function') {
                        callbackFn(err, requests);
                    }
                }
            });
        }

        getShoppingList(callbackFn) {
            var params = {
                TableName: 'Shopping'
            };
            this.documentClient.scan(params, (err, data) => {
                if (err) {
                    callbackFn(err);
                } else {
                    let shoppingList = new ShoppingList();
                    data.Items.forEach((item) => {
                        let shoppingItem = new ShoppingItem({
                            name: item.item,
                            timestamp: item.timestamp,
                            quantity: item.quantity

                        });
                        shoppingList.addItem(shoppingItem);
                    });
                    if (typeof callbackFn === 'function') {
                        callbackFn(err, shoppingList);
                    }
                }
            });
        }
    }
    let srv = new AWSService();
    return srv;
});
