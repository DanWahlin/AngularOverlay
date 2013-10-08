(function () {

    angular.module('customersApp', ['ngRoute', 'wc.Directives'])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: '/app/views/customers.html',
                    controller: 'CustomersController'
                })
                .otherwise({ redirectTo: '/' });
        }]);

}());






