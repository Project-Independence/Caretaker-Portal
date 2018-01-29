angular.module("app").controller("MainController", function ($mdSidenav, AWSService, $mdDialog, SeniorDataService, $window, $scope) {
    class MainController {
        constructor() {
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
