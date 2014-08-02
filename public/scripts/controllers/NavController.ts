/// <reference path="../lib/angularjs.d.ts" />

module App {
	export class NavController {
		/**
		 * Dependencies: The same as the parameters of the constructor.
		 * @type {string[]} The names of dependencies passed as parameters to the constructor of this class
		 */
		public static $inject = ["$scope", "$location"];

		constructor (private $scope:INavScope, private $location:ng.ILocationService) {
			$scope.viewModel = this;
		}

		public viewAllTasks ():void {
			this.$location.url("/");
		}

		public createTask ():void {
			this.$location.url("/create");
		}
	}

	/**
	 * The $scope of the AllTasks model/view/controller.
	 */
	export interface INavScope extends ng.IScope {
		viewModel:NavController;
	}
}