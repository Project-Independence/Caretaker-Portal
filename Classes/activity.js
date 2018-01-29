angular.module("app").factory("Activity", function () {
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
    }

    return Activity;
});
