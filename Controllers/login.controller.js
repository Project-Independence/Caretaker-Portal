angular.module("app").controller("LoginController", function ($window, AWSService) {
    class LoginController {
        constructor() {
            this.username = '';
            this.password = '';
        }

        login() {
            //    $window.location.href = '/index.html';
            AWSService.login(this.username, this.password, (success) => {
                if (success) {
                    console.log("success");
                    $window.location.href = '/index.html';
                } else {
                    console.log("failure");
                }
            });
        }

    }
    return new LoginController();
});
