angular.module("app").factory("Activity", function (AWSService) {
    class Activity {
        constructor(descriptor) {
            Object.assign(this, {
                id: descriptor.id,
                data: descriptor.data,
                caretakerID: 0,
                date: descriptor.date,
                time: ''
            }, descriptor);
        }

        logActivity() {
            AWSService.logActivity(this);
        }
    }

    return Activity;
});
