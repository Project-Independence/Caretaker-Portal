angular.module("app").service("ListService", function (ShoppingItem, SeniorDataService, AWSService) {
    // ---List Service---
    // This service is primarly manipulation of the HTML DOM, used for modifying the lists diplayed
    // on the DOM (moving between requested and completed, color changes ,etc.)

    // This is sparsely commented due to the purpose being only HTML manipulation with no actual logic
    // critical to the logic or functionality of the application.
    class ListService {
        constructor() {
            this.removeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6V18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';
            this.completeSVG = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect y="0" class="noFill" width="22" height="22"/><g><path class="fill" d="M9.7,14.4L9.7,14.4c-0.2,0-0.4-0.1-0.5-0.2l-2.7-2.7c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l2.1,2.1l4.8-4.8c0.3-0.3,0.8-0.3,1.1,0s0.3,0.8,0,1.1l-5.3,5.3C10.1,14.3,9.9,14.4,9.7,14.4z"/></g></svg>';
            this.shoppingList = [];
            this.rideList = [];

            let _this = this;
            angular.element(document).ready(() => {
                document.getElementById('add').addEventListener('click', () => {
                    var value = document.getElementById('item').value;
                    if (value) {
                        document.getElementById('item').value = '';
                        value = value.replace(/\b\w/g, function (l) {
                            return l.toUpperCase()
                        });
                        this.addShoppingItem(value);
                    }
                });

                document.getElementById('item').addEventListener('keydown', function (e) {
                    var value = this.value;
                    console.log(this.value);
                    if (e.code === 'Enter' && value) {
                        this.value = '';
                        value = value.replace(/\b\w/g, function (l) {
                            return l.toUpperCase()
                        });
                        _this.addShoppingItem(value);
                    }
                });
            })

            //
            //            angular.element(document).ready(() => {
            //
            //            })

        }

        loadShoppingItems(shoppingList) {
            document.getElementById('completed').innerHTML = '';
            document.getElementById('todo').innerHTML = '';
            this.shoppingList = shoppingList;
            shoppingList.forEach((item) => {
                this.addShoppingItemToDOM(item.name, item.pickedUp);
            })
        }

        loadRides(rideList) {
            document.getElementById('rides').innerHTML = '';
            document.getElementById('claimed').innerHTML = '';
            this.rideList = rideList;
            rideList.forEach((ride) => {
                this.addRideItemToDOM(ride);
            })
        }


        addShoppingItem(text) {
            var params = {
                Key: {
                    item: text
                },
                AttributeUpdates: {
                    done: {
                        Action: 'PUT',
                        Value: false
                    },
                    caretakerName: {
                        Action: 'PUT',
                        Value: 'N/A'
                    },
                    timestamp: {
                        Actions: 'PUT',
                        Value: Date.now()
                    }
                },
                TableName: 'Shopping'
            }
            let docClient = new AWS.DynamoDB.DocumentClient();
            docClient.update(params, (err, data) => {
                AWSService.recordChange();
                let shoppingItem = new ShoppingItem({
                    name: text,
                    timestamp: params.timestamp,
                    pickedUp: false

                });
                this.shoppingList.push(shoppingItem);
                this.addShoppingItemToDOM(text, false);
            });
        }

        deleteShoppingItem(element, name) {
            var item = element.parentNode.parentNode;
            var parent = item.parentNode;
            var id = parent.id;
            var value = item.innerText;


            $(item).animate({
                left: '250px',
                opacity: '.5',
                minHeight: '0px',
                lineHeight: '0px',
                height: '0px',
                padding: '0px',
                fontSize: '0px',
                margin: '0px',

            }, 200, function () {
                parent.removeChild(item);
            })
            var params = {
                Key: {
                    item: name
                },
                TableName: 'Shopping'
            }
            let docClient = new AWS.DynamoDB.DocumentClient();
            docClient.delete(params, (err, data) => {
                if (err) console.log(err);
            });
        }


        completeShoppingItem(element, shoppingItem) {
            var item = element.parentNode.parentNode;
            var parent = item.parentNode;
            var id = parent.id;
            var value = item.innerText;

            var target = (id === 'todo') ? document.getElementById('completed') : document.getElementById('todo');
            var completed = (id == 'todo');

            shoppingItem.togglePickup(completed, () => {
                let _this = this;
                $(item).animate({
                    opacity: '0',
                    minHeight: '0px',
                    lineHeight: '0px',
                    height: '0px',
                    padding: '0px',
                    fontSize: '0px',
                    margin: '0px'

                }, 100, function () {

                    parent.removeChild(item);
                    target.insertBefore(item, target.childNodes[0]);
                    $(item).animate({
                        opacity: '1',
                        minHeight: '50px',
                        lineHeight: '22px',
                        padding: '14px 100px 14px 14px',
                        margin: '0px 0px 4px 0px',
                        fontSize: '11px',
                        backgroundColor: id == 'todo' ? '#fbfff9' : '#FFF'
                    }, 100, function () {
                        _this.loadShoppingItems(SeniorDataService.shoppingList.list);
                    })
                })
            });
        }

        claimRide(element, ride, claimedElement) {
            var item = element.parentNode.parentNode;
            var parent = item.parentNode;
            var id = parent.id;
            var value = item.innerText;

            var target = (id === 'rides') ? document.getElementById('claimed') : document.getElementById('rides');
            var claimed = (id == 'rides');

            ride.toggleClaim(claimed)

            let _this = this;
            $(item).animate({
                opacity: '0',
                minHeight: '0px',
                lineHeight: '0px',
                height: '0px',
                padding: '0px',
                fontSize: '0px',
                margin: '0px'

            }, 100, function () {


                claimedElement.innerText = claimed ? ride.driverName : '';
                parent.removeChild(item);
                target.insertBefore(item, target.childNodes[0]);
                console.log($(window).width() - 267);
                $(item).animate({
                    opacity: '1',
                    minHeight: '50px',
                    lineHeight: '22px',
                    padding: '14px 100px 14px 14px',
                    margin: '0px 0px 4px 0px',
                    fontSize: '11px',
                    backgroundColor: id == 'rides' ? '#fbfff9' : '#FFF'
                }, 100, function () {
                    _this.loadRides(SeniorDataService.rideRequests);
                })
            })
        }

        addShoppingItemToDOM(text, completed) {
            var list = (completed) ? document.getElementById('completed') : document.getElementById('todo');

            var item = document.createElement('li');
            item.innerText = text;

            var buttons = document.createElement('div');
            buttons.classList.add('buttons');
            buttons.style.width = '100px';

            var remove = document.createElement('button');
            remove.classList.add('remove');
            remove.innerHTML = this.removeSVG;
            // remove.styleb
            let _this = this;
            // Add click event for removing the item
            remove.addEventListener('click', function () {
                _this.deleteShoppingItem(this, text);
            });


            var complete = document.createElement('button');
            complete.classList.add('complete');
            complete.innerHTML = this.completeSVG;


            // Add click event for completing the item
            let shoppingItem = this.shoppingList.find((element) => {
                return element.name === text;
            })
            complete.addEventListener('click', function (event) {
                _this.completeShoppingItem(this, shoppingItem);
            });

            let claimedBy = document.createElement('div');
            claimedBy.innerText = 'test';
            claimedBy.style.position = 'absolute';
            claimedBy.style.right = '90';
            claimedBy.style.top = '14';

            buttons.appendChild(remove);
            buttons.appendChild(complete);
            // if (completed) item.appendChild(claimedBy);
            item.appendChild(buttons);
            if (completed) item.style.backgroundColor = '#fbfff9';

            list.insertBefore(item, list.childNodes[0]);
        }

        addRideItemToDOM(ride) {
            var list = (ride.claimed) ? document.getElementById('claimed') : document.getElementById('rides');

            var date;
            var time;
            var dest;
            var claimer;

            var item = document.createElement('li');
            item.innerText = '';

            var text = document.createElement('div');

            var dateText = document.createElement('div');
            dateText.style.width = '70';
            dateText.innerText = ride.date;

            var pickupTime = document.createElement('div');
            pickupTime.style.width = '100';
            pickupTime.innerText = ride.time;
            pickupTime.style.position = 'absolute';
            pickupTime.style.left = '85';
            pickupTime.style.top = '14';

            var event = document.createElement('div');
            event.style.width = ride.claimed ? 'calc(100% - 267px)' : 'calc(100% - 233px)';
            event.style.height = '22px';
            event.style["text-overflow"] = 'ellipsis';
            event.style["display"] = 'block';
            event.style["white-space"] = 'nowrap';
            event.style["overflow"] = 'hidden';
            event.innerText = ride.event;
            event.style.position = 'absolute';
            event.style.left = '162';
            event.style.top = '14';

            var buttons = document.createElement('div');
            buttons.classList.add('buttons');
            buttons.style.width = '50px';

            var remove = document.createElement('button');
            remove.classList.add('remove');
            remove.innerHTML = this.removeSVG;

            var img = document.createElement('button');
            img.classList.add('remove');


            let _this = this;
            // Add click event for removing the item

            var complete = document.createElement('button');
            complete.classList.add('complete');
            complete.innerHTML = this.completeSVG;

            var claimedBy = document.createElement('div');
            claimedBy.innerText = ride.claimed ? ride.driverName : '';
            claimedBy.style.position = 'absolute';
            claimedBy.style.right = '63';
            claimedBy.style.top = '14';

            // Add click event for completing the item
            let rideObj = this.rideList.find((element) => {
                return element.id === ride.date + '' + ride.time;
            })
            complete.addEventListener('click', function (event) {
                _this.claimRide(this, rideObj, claimedBy);
            });

            //buttons.appendChild(remove);
            buttons.appendChild(complete);
            item.appendChild(buttons);
            text.appendChild(dateText);
            text.appendChild(claimedBy);
            text.appendChild(pickupTime);
            text.appendChild(event);
            item.appendChild(text);
            if (ride.claimed) item.style.backgroundColor = '#fbfff9';

            list.insertBefore(item, list.childNodes[0]);

        }

    }


    let srv = new ListService();
    return srv;
});
