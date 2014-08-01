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
				var deadline:TimeLength = new TimeLength(frequency, deadlineType);
				var durationValue:number = this.$scope.durationValue;
				var durationType:string = this.$scope.durationType ? this.$scope.durationType.name : null;
				var duration:TimeLength = this.$scope.hasDuration ? new TimeLength(
						durationValue, durationType) : null;

				var newTask:Task = {
					goal: goal,
					quantity: quantity,
					duration: duration,
					deadline: deadline,
					level: 1,
					lastCompleted: null,
					dateCreated: new Date()
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
		duration:TimeLength;

		/**
		 * After how long should the task be repeated?
		 */
		deadline:TimeLength;

		/**
		 * All tasks start at level 1. Higher level tasks are more difficult than their predecessors.
		 */
		level:number;

		/**
		 * When the task was last completed. Starts at 'null' if it hasn't been done yet.
		 */
		lastCompleted:Date;

		/**
		 * When the task was created.
		 */
		dateCreated:Date;
	}

	export class TimeLength {
		amount:number;
		time:string;

		constructor (quantity:number, type:string) {
			this.amount = quantity;
			this.time = type;
		}
	}
}