app.directive("ngResize", function ($window) {
    return {
        scope: {
            ngResize: "="
        },
        link: function ($scope, element, attrs) {
            angular.element($window).on("resize", function () {
                $scope.ngResize = "Smith";
                $scope.$apply();
            });
        }
    }
});
