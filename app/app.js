(function () {

    angular.module('customersApp', ['ngRoute', 'wc.Directives'])
        .config(['$routeProvider','wcOverlayConfigProvider', function ($routeProvider, wcOverlayConfigProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: '/app/views/customers.html',
                    controller: 'CustomersController'
                })
                .otherwise({ redirectTo: '/' });
            wcOverlayConfigProvider.setDelay(100);
            wcOverlayConfigProvider.setExceptionUrls(            [
                {
                    method: 'GET',
                    url:    '/api/dataservice/existingcustomers'
                }
            ]);
        }]);
}());






