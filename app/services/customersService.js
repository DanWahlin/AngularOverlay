(function () {

    var customersService = function ($http) {

        var serviceBase = '/api/dataservice/',
            customersFactory = {};

        customersFactory.getExistingCustomers = function () {
            return $http.get(serviceBase + 'existingcustomers');
        };

        customersFactory.getNewCustomers = function (path) {
            return $http.get(serviceBase + 'newcustomers');
        };

        return customersFactory;

    };

    angular.module('customersApp').factory('customersService',
        ['$http', customersService]);

}());