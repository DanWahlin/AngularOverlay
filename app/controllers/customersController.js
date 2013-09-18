angular.module('customersApp')
    .controller('CustomersController', ['$scope', 'customersService',
    function ($scope, customersService) {
        $scope.existingCustomers = [];
        $scope.newCustomers = [];

        init();

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

        $scope.refreshCustomers = function () {
            init();
        }
}]);
