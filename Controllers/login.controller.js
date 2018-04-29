angular.module("app").controller("LoginController", function ($window, $scope, AWSService) {
    class LoginController {
        constructor() {
            this.username = '';
            this.password = '';
            this.showLogin = true;
        }

        login() {
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

    }
    return new LoginController();
});
