/// <reference path="lib/angularjs.d.ts" />
/// <reference path="lib/angular-route.d.ts" />
/// <reference path="lib/angular-resource.d.ts" />
/// <reference path="controllers/NavController.ts" />
/// <reference path="controllers/CreateTaskController.ts" />
/// <reference path="controllers/AllTasksController.ts" />
/// <reference path="Task.ts" />

module App {
	var cascadeApp = angular.module("cascadeApp", ["ngRoute", "ngResource"]);

	cascadeApp.controller("NavController", NavController);
	cascadeApp.controller("CreateTaskController", CreateTaskController);
	cascadeApp.controller("AllTasksController", AllTasksController);

	cascadeApp.config(["$routeProvider", ($routeProvider:ng.route.IRouteProvider) => {
		$routeProvider
		.when("/", {
			templateUrl: "partials/all-tasks.html",
			controller: AllTasksController
		})
		.when("/create", {
			templateUrl: "partials/create-task.html",
			controller: CreateTaskController
		})
		.otherwise({redirectTo: "/"});
	}]);

	cascadeApp.factory("taskFactory", ($resource:ng.resource.IResourceService) : ITaskResource => {
		// Need a custom update action because the default Angular uses is POST rather than PUT.
		var updateAction:ng.resource.IActionDescriptor = {
			method: "PUT",
			isArray: false
		};
		// MongoDB uses _id property instead of id, so define id to be the object's _id field.
		return <ITaskResource> $resource("/tasks/:id", {id: "@_id"}, {
			update: updateAction
		});
	});
}