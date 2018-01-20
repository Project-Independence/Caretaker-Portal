angular.module("app").controller("MainController",
    class MainController {
        constructor(AWSService, $mdDialog, SeniorDataService) {
            this.AWSService = AWSService;
            this.seniorDataService = SeniorDataService;

            this.sns = new AWS.SNS();
        }

        sendEmail(subject, body) {
            var params = {
                Message: body,
                Subject: subject,
                TopicArn: 'arn:aws:sns:us-east-1:112632085303:CaretakerPortal'
            };
            this.sns.publish(params, function (err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                else console.log(data); // successful response
            });
        }
    });
