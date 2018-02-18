angular.module("app").factory("Activity", function (AWSService) {
    class Activity {
        constructor(descriptor) {
            Object.assign(this, {
                id: '',
                data: {},
                caretakerID: 0,
                date: '',
                time: ''
            }, descriptor);
        }

        log() {

        }
    }

    return Activity;
});
