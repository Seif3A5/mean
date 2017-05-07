// logger.js
(function () {
    'use strict';

    var app = angular.module('app', ['ngRoute', 'ngCookies']);

    app.factory('sessionInjector', ['$cookies', function ($cookies) {
        var sessionInjector = {
            request: function (config) {
                config.headers['Authorization'] = "JWT " + $cookies.get("token");
                console.log("request", config);
                return config;
            }
        };
        return sessionInjector;
    }]);

    app.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
        //================================================
        // Check if the user is connected
        //================================================
        var checkLoggedin = function ($q, $timeout, $http, $location, $rootScope) {
            // Initialize a new promise
            var deferred = $q.defer();

            var $cookies;
            angular.injector(['ngCookies']).invoke(['$cookies', function (_$cookies_) {
                $cookies = _$cookies_;
            }]);

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin',
                {
                    headers: {'Authorization': 'JWT ' + $cookies.get("token")}
                }
            ).then(function (user) {
                // Authenticated
                if (user !== '0')
                /*$timeout(deferred.resolve, 0);*/
                    deferred.resolve();

                // Not Authenticated
                else {
                    $rootScope.message = 'You need to log in.';
                    //$timeout(function(){deferred.reject();}, 0);
                    deferred.reject();
                    $location.url('/login');
                }
            });

            return deferred.promise;
        };
        //================================================

        //================================================
        // Add an interceptor for AJAX errors
        //================================================
        $httpProvider.interceptors.push('sessionInjector');
        $httpProvider.interceptors.push(function ($q, $location) {
            return {
                response: function (response) {
                    // do something on success
                    return response;
                },
                responseError: function (response) {
                    if (response.status === 401)
                        $location.url('/login');
                    return $q.reject(response);
                }
            };
        });


        $routeProvider
            .when('/', {
                templateUrl: 'dashboard.html',
                controller: 'ReparateurCtrl',
                resolve: {loggedin: checkLoggedin}
            })
            .when('/login', {
                templateUrl: 'login.html',
                controller: 'LoginCtrl'
            })
            .otherwise({redirectTo: '/'});


    }])

        .run(function ($rootScope, $http) {
            $rootScope.message = '';

            // Logout function is available in any pages
            $rootScope.logout = function () {
                $rootScope.message = 'Logged out.';
                $http.post('/logout');
            };
        });

    /**********************************************************************
     * Login controller
     **********************************************************************/
    app.controller('LoginCtrl', function ($scope, $rootScope, $http, $location, $cookies) {
        // This object will be filled by the form
        $scope.user = {};

        // Register the login() function
        $scope.login = function () {
            $http.post('/login', {
                username: $scope.user.username,
                password: $scope.user.password
            })
                .then(function (data) {
                    // No error: authentication OK
                    $rootScope.message = 'Authentication successful!';

                    $cookies.put("token", data.data.token);
                    console.log(data.data.token);
                    window.location = '/reparateur';
                })
                .then(function () {
                    // Error: authentication failed
                    $rootScope.message = 'Authentication failed.';
                    $location.url('/login');
                });
        };
    });

    /**********************************************************************
     * ReparateurCtrl controller
     **********************************************************************/
    app.controller('ReparateurCtrl', function ($scope, $http, $cookies) {
        // List of users got from the server
        $scope.notifications = [];
        $scope.currentUser = null;

        $http.get('/notifications').then(function (response) {
            $scope.notifications = response.data;
        });

        $http.get('/current').then(function (response) {
            $scope.currentUser = response.data;
        });

        $scope.logout = function () {
            $cookies.remove("token");
            window.location = "/reparateur";
        };

        $scope.changeAvailability = function (status) {
            $http.put('/status/' + status).then(function (response) {
                console.log("status changed");
            });
        };

        $scope.notify = function (notification) {
            if (notification.status != "Traitée") {
                notification.status = "Traitée";
                $http.put("/notification/notify", notification).then(function (response) {
                    console.log("client has been notified");
                });
                alert("Le client a été notifier");
            }
        };
    });

})();