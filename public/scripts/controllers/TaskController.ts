/// <reference path="../lib/moment.d.ts" />
/// <reference path="../lib/angularjs.d.ts" />

module App {
	export class TaskController {
		/**
		 * The "database" of tasks.
		 */
		private tasks:Task[] = [];

		/**
		 * The options for the Select fields in the form.
		 */
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
			$scope.viewModel = this;
		}

		/**
		 * Called when the form is submitted.
		 * @param form The form whose submit action was triggered
		 */
		public submit (form:ng.IFormController):void {
			if (form.$valid && this.integersAreValid()) {
				var goal:string = this.$scope.goal;
				var quantity:number = this.$scope.quantity;
				var frequency:number = this.$scope.frequency;
				var deadlineType:string = this.$scope.deadlineType ? this.$scope.deadlineType.name : null;
				var deadline:Duration = TaskController.createDuration(frequency, deadlineType);
				var durationValue:number = this.$scope.durationValue;
				var durationType:string = this.$scope.durationType ? this.$scope.durationType.name : null;
				var duration:Duration = this.$scope.hasDuration ? TaskController.createDuration(
						durationValue, durationType) : null;

				var newTask:Task = {
					goal: goal,
					quantity: quantity,
					duration: duration,
					deadline: deadline,
					level: 1
				};

				// Add the new task to the task "database."
				this.tasks.push(newTask);

				this.reset(form);
			}
		}

		public reset (form:ng.IFormController) {
			this.$scope.goal = null;
			this.$scope.quantity = null;
			this.$scope.frequency = null;
			this.$scope.deadlineType = this.DEADLINE_OPTIONS[1];
			this.$scope.hasDuration = null;
			this.$scope.durationValue = null;
			this.$scope.durationType = this.DURATION_OPTIONS[0];
			form.$setPristine();
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

		/**
		 * Helper function to create a new moment.Duration.
		 * @param amount The number of the Duration
		 * @param time The type of Duration (e.g. "hours", "minutes", "weeks")
		 * @returns {Duration} A Duration representing the amount of time described by the parameters
		 */
		private static createDuration (amount:number, time:string):Duration {
			if (time === "weeks") {
				return moment.duration(amount * 7, "days");
			} else {
				return moment.duration(amount, time);
			}
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
		goal:string;
		quantity:number;
		frequency:number;
		deadlineType:TimeOption;
		hasDuration:boolean;
		durationValue:number;
		durationType:TimeOption;
		viewModel:TaskController;
	}

	export class Task {
		/**
		 * A description of the task. Example: "Go to bed before midnight"
		 */
		goal:string;

		/**
		 * How many times in a period should this task be done?
		 */
		quantity:number;

		/**
		 * How long should the task be done for?
		 */
		duration:Duration;

		/**
		 * After how long should the task be repeated?
		 */
		deadline:Duration;

		/**
		 * All tasks start at level 1. Higher level tasks are more difficult than their predecessors.
		 */
		level:number;
	}
}