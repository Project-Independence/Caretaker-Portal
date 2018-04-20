angular.module("app").controller("MainController", function ($mdSidenav, AWSService, $mdDialog, SeniorDataService, UserDataService, ListService, MessagingService, $window, $scope, $http) {
    class MainController {
        constructor() {
            let date = new Date("January 31 1980 12:30");
            let time = new Date('March 2, 08 16:20');
            let final = new Date(date.getYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), 0, 0);
            console.log(final);

            this.userDataService = UserDataService;
            this.username = '';
            this.password = '';
            this.confirmPassword = '';
            this.showLogin = true;
            this.loginMode = 0;
            this.AWSService = AWSService;
            this.seniorDataService = SeniorDataService;
            this.sns = new AWS.SNS();
            this.currentView = 'Home';
            setInterval(() => {
                if (SeniorDataService.changePending) {
                    SeniorDataService.initActivities();
                    SeniorDataService.changePending = false;
                    if (SeniorDataService.rideRequests) {
                        ListService.loadRides(SeniorDataService.rideRequests);
                    }
                    if (SeniorDataService.shoppingList) {
                        ListService.loadShoppingItems(SeniorDataService.shoppingList.list);
                    }


                    MessagingService.refreshMessages();
                    $scope.$apply();
                }
            }, 500);

            angular.element(document).ready(() => {
                console.log(document.getElementById('todo'))
            });

            this.loginData = {
                "ldz": {
                    password: '1234',
                    id: 4,
                    firstName: 'Lucas',
                    proPic: 'https://scontent.fijd1-1.fna.fbcdn.net/v/t31.0-8/24831324_1878378875523810_381839370215089745_o.jpg?_nc_cat=0&oh=5958fa81643a76425b591ebb63257d38&oe=5B6C44E0'
                },
                "jd.samko": {
                    password: 'Cigna1234',
                    id: 3,
                    firstName: 'John',
                    proPic: 'https://scontent.fijd1-1.fna.fbcdn.net/v/t31.0-8/20017560_1427770983986397_2252778320389310674_o.jpg?_nc_cat=0&_nc_eui2=v1%3AAeFJn3f8Zq1dLvChlmFZf_ijcHfKwbABKIsHFL91Y3gtVPwUFCYa9GtMjbt_39WaEsxEX_JFbr-PHULVN-ZIHMPBZTrQcDcNqXLQntmbIj5LGg&oh=ec5fea6060a5641e2dc665333dc35527&oe=5B575DC3'
                }
            }
        }

        login() {
            if (this.loginData[this.username]) {
                if (this.password == this.loginData[this.username].password) {
                    setTimeout(() => {
                        UserDataService.name = this.loginData[this.username].firstName;
                        UserDataService.UserID = this.loginData[this.username].id;
                        UserDataService.proPic = this.loginData[this.username].proPic;
                        SeniorDataService.changePending = true;
                        AWSService.getFirebaseToken();
                        this.showLogin = false;
                    }, 500);
                } else {
                    alert("Incorrect password.");
                }
            } else {
                alert("User does not exist.");
            }
            //    $window.location.href = '/index.html';
            //            AWSService.login(this.username, this.password, (success) => {
            //                if (success) {
            //                    this.showLogin = false;
            //                    $scope.$apply();
            //                    console.log("success");
            //                } else {
            //                    console.log("failure");
            //                }
            //            });
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

        toggleSidebar() {
            $mdSidenav('sidenav').toggle();
        }

        selectView(name) {
            this.currentView = name;
        }
    }
    return new MainController();
});
