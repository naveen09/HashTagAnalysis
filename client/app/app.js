'use strict';

angular.module('hashtagAnalyticsApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
    ])
.config(function ($routeProvider, $locationProvider) {
    $routeProvider
    .otherwise({
        redirectTo: '/'
    });

    $locationProvider.html5Mode(true);
});