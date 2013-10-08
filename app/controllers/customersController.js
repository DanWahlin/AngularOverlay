(function () {

    var customersController = function ($scope, customersService) {
        $scope.existingCustomers = [];
        $scope.newCustomers = [];

        init();

        $scope.refreshCustomers = function () {
            init();
        }

        function init() {
            getExistingCustomers();
            getNewCustomers();
        }

        function getExistingCustomers() {
            customersService.getExistingCustomers()
            .then(function (results) {
                $scope.existingCustomers = results.data;
            }, function (error) {
                alert(error.message);
            });
        }

        function getNewCustomers() {
            customersService.getNewCustomers()
            .then(function (results) {
                $scope.newCustomers = results.data;
            }, function (error) {
                alert(error.message);
            });
        }
    };

    angular.module('customersApp').controller('CustomersController',
        ['$scope', 'customersService', customersController]);

}());
