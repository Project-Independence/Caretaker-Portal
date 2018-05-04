angular.module("app").service("MessagingService", function (AWSService, UserDataService, Activity) {
    // ---Messaging Service---
    // This service is primarly manipulation of the HTML DOM, used for modifying the lists diplayed
    // on the DOM (add messages, animations, etc.)

    // This is sparsely commented due to the purpose being only HTML manipulation with no actual logic
    // critical to the logic or functionality of the application.

    class MessagingService {
        constructor() {
            let _this = this;
            angular.element(document).ready(() => {
                $('body > div > div > div:nth-child(2) > span').click(function () {
                    $(".mytext").trigger({
                        type: 'keydown',
                        which: 13,
                        keyCode: 13
                    });
                })
                $(".mytext").on("keydown", function (e) {
                    console.log("keydown")
                    if (e.which == 13) {
                        var text = $(this).val();
                        if (text !== "") {
                            //                            let activityData = text;
                            //                            let activity = new Activity({
                            //                                id: Date.now(),
                            //                                data: activityData,
                            //                                timestamp: Date.now(),
                            //                                type: 'caretaker-message',
                            //                                caretakerID: UserDataService.UserID
                            //                            });
                            //                            activity.logActivity();

                            AWSService.sendMessage(text, () => {
                                _this.insertChat("me", text, Date.now());
                                $(this).val('');

                                var objDiv = document.getElementById("messages");
                                objDiv.scrollTop = objDiv.scrollHeight;
                            })
                        }
                    }
                });
            })
        }


        refreshMessages() {
            document.getElementById('messages').innerHTML = '';

            //-- Clear Chat


            //-- Print Messages


            let _this = this;
            AWSService.getMessages((err, data) => {
                document.getElementById('messages').innerHTML = '';
                data.sort(function (a, b) {
                    var keyA = a.timestamp,
                        keyB = b.timestamp;
                    // Compare the 2 dates
                    if (keyA > keyB) return 1;
                    if (keyA < keyB) return -1;
                    return 0;
                });
                data.forEach((message) => {
                    if ((message.CaretakerID == UserDataService.UserID || message.CaretakerID == 0) && !message.UserID) {
                        _this.insertChat("you", message.Message, message.timestamp);
                    } else if (message.UserID && message.CaretakerID == UserDataService.UserID) {
                        _this.insertChat("me", message.Message, message.timestamp);
                    }
                })

                var objDiv = document.getElementById("messages");
                objDiv.scrollTop = objDiv.scrollHeight;
            })
        }



        formatAMPM(date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return strTime;
        }

        //-- No use time. It is a javaScript effect.
        insertChat(who, text, timestamp) {
            var control = "";
            var date = this.formatAMPM(new Date(timestamp));

            if (who != "me") {
                control = '<li style="width:100%">' +
                    '<div class="msj macro">' +
                    '<div class="text text-l">' +
                    '<p>' + text + '</p>' +
                    '<p><small>' + date + '</small></p>' +
                    '</div>' +
                    '</div>' +
                    '</li>';
            } else {
                control = '<li style="width:100%;">' +
                    '<div class="msj-rta macro">' +
                    '<div class="text text-r">' +
                    '<p>' + text + '</p>' +
                    '<p><small>' + date + '</small></p>' +
                    '</div>' +
                    '<div></div>' +
                    '</li>';
            }
            let element = document.getElementById('messages');
            let newElement = document.createElement('div');
            newElement.innerHTML = control;
            element.append(newElement);

        }

        resetChat() {
            // $("ul").empty();
        }



    }
    let srv = new MessagingService();
    return srv;
});
