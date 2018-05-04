angular.module("app").controller("MainController", function ($mdSidenav, AWSService, $mdDialog, SeniorDataService, UserDataService, ListService, MessagingService, $window, $scope, $http) {
    // --- View Controller ---
    class MainController {
        constructor() {
            // init fields, services, current view
            this.userDataService = UserDataService;
            this.username = 'ldz';
            this.password = '1234';
            this.confirmPassword = '';
            this.showLogin = true;
            this.loginMode = 0;
            this.AWSService = AWSService;
            this.seniorDataService = SeniorDataService;
            this.sns = new AWS.SNS();
            this.currentView = 'Home';
            // Check database for new changes
            // on change, refresh all lists, feeds, and messages
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


                    this.login();
                    MessagingService.refreshMessages();
                    $scope.$apply();
                }
            }, 500);

            // mocked up data due to Cognito issues
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

        // use the credientials entered to authenticate the user
        // mocked up for demo due to issues with Cognito close to presentation day
        login() {
            if (this.loginData[this.username]) {
                if (this.password == this.loginData[this.username].password) {
                    UserDataService.name = this.loginData[this.username].firstName;
                    UserDataService.UserID = this.loginData[this.username].id;
                    UserDataService.proPic = this.loginData[this.username].proPic;
                    SeniorDataService.changePending = true;
                    AWSService.getFirebaseToken();
                    this.showLogin = false;
                } else {
                    alert("Incorrect password.");
                }
            } else {
                alert("User does not exist.");
            }
        }

        // open / close the profile side bar (no longer in use)
        toggleSidebar() {
            $mdSidenav('sidenav').toggle();
        }

        // select a view by name (home, shopping , rides, messaging)
        // set as current view for the sidebar title 
        selectView(name) {
            this.currentView = name;
        }
    }
    return new MainController();
});
