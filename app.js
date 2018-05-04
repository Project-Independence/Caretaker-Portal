let app = angular.module("app", ["ngMaterial"]);
app.run(

    // first JS file to work, starts firebase service worker
    class App {
        constructor($window) {
            var worker = new Worker('firebase-messaging-sw.js');
        };
    });
