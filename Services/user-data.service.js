angular.module("app").service("UserDataService", function () {
    class UserDataService {
        constructor() {
            this.name = 'Lucas';
            this.UserID = 4;
            this.proPic = '';
        }
    }
    let srv = new UserDataService();
    return srv;
});
