/// <reference path="../lib/angularjs.d.ts" />
/// <reference path="CreateTaskController.ts" />

module App {
	export class AllTasksController {
		/**
		 * Dependencies: The same as the parameters of the constructor.
		 * @type {string[]} The names of dependencies passed as parameters to the constructor of this class
		 */
		public static $inject = ["$scope", "taskFactory"];

		constructor (private $scope:IAllTasksScope, private taskFactory:ITaskResource) {
			$scope.viewModel = this;
			$scope.allTasks = taskFactory.query();
		}
	}

	/**
	 * The $scope of the AllTasks model/view/controller.
	 */
	export interface IAllTasksScope extends ng.IScope {
		allTasks:ITask[];
		viewModel:AllTasksController;
	}
}