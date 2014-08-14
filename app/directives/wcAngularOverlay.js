(function () {

    var wcOverlayDirective = function ($q, $timeout, $window, httpInterceptor, wcOverlayConfig) {
        return {
            restrict: 'EA',
            transclude: true,
            scope: {
                wcOverlayDelay: "@"
            },
            template: '<div id="overlay-container" class="overlayContainer">' +
                            '<div id="overlay-background" class="overlayBackground"></div>' +
                            '<div id="overlay-content" class="overlayContent" data-ng-transclude>' +
                            '</div>' +
                        '</div>',
            link: function (scope, element, attrs) {
                var overlayContainer = null,
                    timerPromise = null,
                    timerPromiseHide = null,
                    inSession = false,
                    queue = [],
                    overlayConfig = wcOverlayConfig.getConfig();

                init();

                function init() {
                    wireUpHttpInterceptor();
                    if (window.jQuery) wirejQueryInterceptor();
                    overlayContainer = document.getElementById('overlay-container');
                }

                //Hook into httpInterceptor factory request/response/responseError functions                
                function wireUpHttpInterceptor() {

                    httpInterceptor.request = function (config) {
                        //I want to have a condition to not show the overlay on specific calls
                        if(shouldShowOverlay(config.method, config.url))
                            processRequest();
                        return config || $q.when(config);
                    };

                    httpInterceptor.response = function (response) {
                        processResponse();
                        return response || $q.when(response);
                    };

                    httpInterceptor.responseError = function (rejection) {
                        processResponse();
                        return $q.reject(rejection);
                    };
                }

                //Monitor jQuery Ajax calls in case it's used in an app
                function wirejQueryInterceptor() {
                    $(document).ajaxStart(function () {
                        processRequest();
                    });

                    $(document).ajaxComplete(function () {
                        processResponse();
                    });

                    $(document).ajaxError(function () {
                        processResponse();
                    });
                }

                function processRequest() {
                    queue.push({});
                    if (queue.length == 1) {
                        timerPromise = $timeout(function () {
                            if (queue.length) showOverlay();
                        }, scope.wcOverlayDelay ? scope.wcOverlayDelay : overlayConfig.delay); //Delay showing for 500 millis to avoid flicker
                    }
                }

                function processResponse() {
                    queue.pop();
                    if (queue.length == 0) {
                        //Since we don't know if another XHR request will be made, pause before
                        //hiding the overlay. If another XHR request comes in then the overlay
                        //will stay visible which prevents a flicker
                        timerPromiseHide = $timeout(function () {
                            //Make sure queue is still 0 since a new XHR request may have come in
                            //while timer was running
                            if (queue.length == 0) {
                                hideOverlay();
                                if (timerPromiseHide) $timeout.cancel(timerPromiseHide);
                            }
                        }, scope.wcOverlayDelay ? scope.wcOverlayDelay : overlayConfig.delay);
                    }
                }

                function showOverlay() {
                    var w = 0;
                    var h = 0;
                    if (!$window.innerWidth) {
                        if (!(document.documentElement.clientWidth == 0)) {
                            w = document.documentElement.clientWidth;
                            h = document.documentElement.clientHeight;
                        }
                        else {
                            w = document.body.clientWidth;
                            h = document.body.clientHeight;
                        }
                    }
                    else {
                        w = $window.innerWidth;
                        h = $window.innerHeight;
                    }
                    var content = document.getElementById('overlay-content');
                    var contentWidth = parseInt(getComputedStyle(content, 'width').replace('px', ''));
                    var contentHeight = parseInt(getComputedStyle(content, 'height').replace('px', ''));

                    content.style.top = h / 2 - contentHeight / 2 + 'px';
                    content.style.left = w / 2 - contentWidth / 2 + 'px'

                    overlayContainer.style.display = 'block';
                }

                function hideOverlay() {
                    if (timerPromise) $timeout.cancel(timerPromise);
                    overlayContainer.style.display = 'none';
                }

                var getComputedStyle = function () {
                    var func = null;
                    if (document.defaultView && document.defaultView.getComputedStyle) {
                        func = document.defaultView.getComputedStyle;
                    } else if (typeof (document.body.currentStyle) !== "undefined") {
                        func = function (element, anything) {
                            return element["currentStyle"];
                        };
                    }

                    return function (element, style) {
                        return func(element, null)[style];
                    }
                }();

                function shouldShowOverlay(method, url){
                    var searchCriteria = {
                        method: method,
                        url: url
                    }
                    return angular.isUndefined(findUrl(overlayConfig.exceptUrls, searchCriteria));
                }

                function findUrl(urlList, searchCriteria){
                    var retVal = undefined;
                    angular.forEach(urlList, function(url){
                        if(angular.equals(url, searchCriteria)){
                            retVal = true;
                            return false; //break out of forEach
                        }
                    });
                    return retVal;
                }
            }
        }
    },

    httpProvider = function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    },

    httpInterceptor = function () {
        return {}
    };

    var wcOverlayConfig = function(){

        //default config
        var config = {
            delay: 500,
            exceptUrls: []
        };

        //set delay
        this.setDelay = function(delayTime){
            config.delay = delayTime;
        };

        //set exception urls
        this.setExceptionUrls = function(urlList){
            config.exceptUrls = urlList;
        }

        this.$get = function(){
            return {
                getDelayTime: getDelayTime,
                getExceptUrls: getExceptUrls,
                getConfig: getConfig
            };

            function getDelayTime(){
                return config.delay;
            }

            function getExceptUrls(){
                return config.exceptUrls;
            }

            function getConfig(){
                return config;
            }
        };
    }

    var wcDirectivesApp = angular.module('wc.Directives', []);

    //provider service to setup overlay configuration in the app.config
    //this will configure the delay and the APIs which you don't want to show overlay on
    wcDirectivesApp.provider('wcOverlayConfig', wcOverlayConfig);

    //Empty factory to hook into $httpProvider.interceptors
    //Directive will hookup request, response, and responseError interceptors
    wcDirectivesApp.factory('httpInterceptor', httpInterceptor);

    //Hook httpInterceptor factory into the $httpProvider interceptors so that we can monitor XHR calls
    wcDirectivesApp.config(['$httpProvider', httpProvider]);

    //Directive that uses the httpInterceptor factory above to monitor XHR calls
    //When a call is made it displays an overlay and a content area 
    //No attempt has been made at this point to test on older browsers
    wcDirectivesApp.directive('wcOverlay', ['$q', '$timeout', '$window', 'httpInterceptor','wcOverlayConfig', wcOverlayDirective]);

}());