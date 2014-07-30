/// <reference path="../lib/moment.d.ts" />
/// <reference path="../lib/angularjs.d.ts" />

module App {
	export class TaskController {
		/**
		 * The list of tasks.
		 */
		public tasks:Task[];

		public DEADLINE_OPTIONS:TimeOption[] = [	{"name": "hours", "text": "hour(s)"},
														{"name": "days", "text": "day(s)"},
														{"name": "weeks", "text": "week(s)"}];
		public DURATION_OPTIONS:TimeOption[] = [	{"name": "minutes", "text": "minute(s)"},
														{"name": "hours", "text": "hour(s)"}];

		/**
		 * Dependencies: The same as the parameters of the constructor.
		 * @type {string[]} The names of dependencies passed as parameters to the constructor of this class
		 */
		public static $inject = ["$scope"];

		constructor (private $scope:ITaskScope) {
			this.tasks = $scope.tasks = [];
			$scope.viewModel = this;
		}

		/**
		 * Called when the form is submitted.
		 * @param form The form whose submit action was triggered
		 */
		public submit (form:ng.IFormController):void {
			if (form.$valid && this.integersAreValid()) {
				// TODO - create a new Task object from the form values; reset the form
				console.log("form submitted!");
			}
		}

		/**
		 * Helper function to determine whether the numbers entered in the form are integers.
		 * @returns {boolean} true if all required numbers are integers
		 */
		private integersAreValid ():boolean {
			var requiredValuesAreInts:boolean = this.$scope.quantity % 1 === 0 && this.$scope.frequency % 1 === 0;
			var durationIsInt:boolean = this.$scope.hasDuration ? this.$scope.durationValue % 1 === 0 : true;
			return requiredValuesAreInts && durationIsInt;
		}
	}

	/**
	 * Interface that describes the options for a drop-down select where the options are lengths of time.
	 */
	export interface TimeOption {
		name:string;
		text:string;
	}

	/**
	 * The $scope of the Task model/view/controller.
	 */
	export interface ITaskScope extends ng.IScope {
		tasks:Task[];
		quantity:number;
		frequency:number;
		hasDuration:boolean;
		durationValue:number;
		viewModel:TaskController;
	}

	export class Task {
		/**
		 * A description of the task. Example: "Go to bed before midnight"
		 */
		private goal:string;

		/**
		 * How many times in a period should this task be done?
		 */
		private quantity:number;

		/**
		 * How long should the task be done for?
		 */
		private duration:Duration;

		/**
		 * After how long should the task be repeated?
		 */
		private deadline:Duration;

		/**
		 * All tasks start at level 1. Higher level tasks are more difficult than their predecessors.
		 */
		private level:number;
	}
}