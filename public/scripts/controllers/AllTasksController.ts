/// <reference path="../lib/angularjs.d.ts" />

module App {
	export class AllTasksController {
		/**
		 * Dependencies: The same as the parameters of the constructor.
		 * @type {string[]} The names of dependencies passed as parameters to the constructor of this class
		 */
		public static $inject = ["$scope"];

		constructor (private $scope:IAllTasksScope) {
			$scope.viewModel = this;
		}
	}

	/**
	 * The $scope of the AllTasks model/view/controller.
	 */
	export interface IAllTasksScope extends ng.IScope {
		viewModel:AllTasksController;
	}
}