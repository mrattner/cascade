/// <reference path="lib/angularjs.d.ts" />
/// <reference path="lib/angular-route.d.ts" />
/// <reference path="controllers/TaskController.ts" />

module App {
	var cascadeApp = angular.module("cascadeApp", ["ngRoute"]);

	cascadeApp.controller("TaskController", TaskController);

	cascadeApp.config(["$routeProvider", ($routeProvider:ng.route.IRouteProvider) => {
		$routeProvider.when("/create", {
			templateUrl: "partials/create-task.html",
			controller: TaskController
		}).
				otherwise({redirectTo: "/create"});
	}]);
}