let app = angular.module("app", ["ngMaterial"]);
app.run(

    class App {
        constructor($window) {
            var worker = new Worker('firebase-messaging-sw.js');
        };
    });
