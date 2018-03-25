angular.module("app").factory("Activity", function (AWSService, UserDataService) {
    class Activity {
        constructor(descriptor) {
            Object.assign(this, {
                id: descriptor.id,
                data: descriptor.data,
                caretakerID: 0,
                date: descriptor.date,
                time: '',
                caretakerName: UserDataService.name
            }, descriptor);
        }

        logActivity() {
            AWSService.logActivity(this);
        }
    }

    return Activity;
});
