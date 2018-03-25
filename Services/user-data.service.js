angular.module("app").service("UserDataService", function () {
    class UserDataService {
        constructor() {
            this.name = 'Lucas';

        }

    }
    let srv = new UserDataService();
    return srv;
});
