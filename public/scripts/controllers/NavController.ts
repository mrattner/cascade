/// <reference path="../lib/angularjs.d.ts" />
/// <reference path="../User.ts" />

module App {
	export class NavController {
		/**
		 * Dependencies: The same as the parameters of the constructor.
		 * @type {string[]} The names of dependencies passed as parameters to the constructor of this class
		 */
		public static $inject = ["$scope", "$location", "$http", "currentUser"];

		constructor (private $scope:INavScope, private $location:ng.ILocationService, private $http:ng.IHttpService,
				private currentUser:IUser) {
			$scope.viewModel = this;
			$scope.currentUser = currentUser;
		}

		public viewAllTasks ():void {
			this.$location.url("/tasks");
		}

		public createTask ():void {
			this.$location.url("/create");
		}

		public logout ():void {
			this.$http.post("/logout", {}).success(() => {
				this.$location.url("/login");
			});
		}
	}

	/**
	 * The $scope of the AllTasks model/view/controller.
	 */
	export interface INavScope extends ng.IScope {
		viewModel:NavController;
		currentUser:IUser;
	}
}