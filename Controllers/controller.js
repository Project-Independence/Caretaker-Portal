angular.module("app").controller("MainController", function ($mdSidenav, AWSService, $mdDialog, SeniorDataService, $window, $scope, $http) {
    class MainController {
        constructor() {
            this.username = '';
            this.password = '';
            this.confirmPassword = '';
            this.showLogin = false;
            this.loginMode = 0;
            this.AWSService = AWSService;
            this.seniorDataService = SeniorDataService;
            this.sns = new AWS.SNS();
            this.currentView = 'Home';
            setInterval(() => {
                if (SeniorDataService.changePending) {
                    $scope.$apply();
                    SeniorDataService.changePending = false;
                }
            }, 500);
        }

        login() {
            //    $window.location.href = '/index.html';
            AWSService.login(this.username, this.password, (success) => {
                if (success) {
                    this.showLogin = false;
                    $scope.$apply();
                    console.log("success");
                } else {
                    console.log("failure");
                }
            });
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
