/// <reference path="lib/angularjs.d.ts" />
/// <reference path="lib/angular-ui-router.d.ts" />
/// <reference path="lib/angular-resource.d.ts" />

/// <reference path="Task.ts" />
/// <reference path="User.ts" />
/// <reference path="controllers/IndexController.ts" />
/// <reference path="controllers/NavController.ts" />
/// <reference path="controllers/CreateTaskController.ts" />
/// <reference path="controllers/AllTasksController.ts" />
/// <reference path="controllers/FakeTaskController.ts" />s

module App {
	var cascadeApp = angular.module("cascadeApp", ["ui.router", "ngResource"]);

	cascadeApp.controller("IndexController", IndexController);
	cascadeApp.controller("NavController", NavController);
	cascadeApp.controller("CreateTaskController", CreateTaskController);
	cascadeApp.controller("AllTasksController", AllTasksController);
	cascadeApp.controller("FakeTaskController", FakeTaskController);

	function getLoggedIn ($q:ng.IQService, $http:ng.IHttpService) {
		var deferred = $q.defer();

		// Check whether the user is logged in.
		$http.get("/loggedin").success((user:any) => {
			if (user !== "false") {
				deferred.resolve(user);
			} else {
				deferred.resolve(false);
			}
		}).error((err:any) => {
			deferred.reject(err);
		});
		return deferred.promise;
	}

	function checkLoggedIn ($q:ng.IQService, $http:ng.IHttpService, $location:ng.ILocationService) {
		var deferred = $q.defer();

		getLoggedIn($q, $http).then((user:any) => {
			if (user) {
				deferred.resolve(user);
			} else {
				deferred.reject("Not logged in");
				$location.url("/login");
			}
		});
	}

	cascadeApp.config(["$stateProvider",
		($stateProvider:ng.ui.IStateProvider) => {
			$stateProvider
			.state("login", {
				url: "/login",
				templateUrl: "partials/login-signup.html",
				controller: IndexController
			})
			.state("nav", {
				templateUrl: "partials/nav.html",
				controller: NavController,
				resolve: {currentUser: getLoggedIn}
			})
			.state("nav.tasks", {
				url: "/tasks",
				templateUrl: "partials/all-tasks.html",
				controller: AllTasksController,
				resolve: {currentUser: checkLoggedIn}
			})
			.state("nav.create", {
				url: "/create",
				templateUrl: "partials/create-task.html",
				controller: CreateTaskController,
				resolve: {currentUser: checkLoggedIn}
			});
		}
	]);

	cascadeApp.config(["$urlRouterProvider",
		($urlRouterProvider:ng.ui.IUrlRouterProvider) => {
			$urlRouterProvider
			.otherwise("/tasks");
		}
	]);

	cascadeApp.factory("userFactory", ($resource:ng.resource.IResourceService):IUserResource => {
		// Need a custom update action because the default Angular uses is POST rather than PUT.
		var updateAction:ng.resource.IActionDescriptor = {
			method: "PUT",
			isArray: false
		};
		// MongoDB uses _id property instead of id, so define id to be the object's _id field.
		return <IUserResource> $resource("/users/:id", {id: "@_id"}, {
			update: updateAction
		});
	});

	cascadeApp.factory("taskFactory", ($resource:ng.resource.IResourceService):ITaskResource => {
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