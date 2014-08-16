/// <reference path="../lib/angularjs.d.ts" />
/// <reference path="../Task.ts" />

module App {
	export class CreateTaskController {
		/**
		 * The options for the Select fields in the form.
		 */
		public FREQUENCY_OPTIONS:Option[] = [{name: "1", text:"week"},
											{name: "2", text: "two weeks"},
											{name: "3", text:"three weeks"},
											{name: "4", text:"four weeks"}];
		public DURATION_OPTIONS:Option[] = [{name: "minutes", text: "minute(s)"},
											{name: "hours", text: "hour(s)"}];

		/**
		 * Dependencies: The same as the parameters of the constructor.
		 * @type {string[]} The names of dependencies passed as parameters to the constructor of this class
		 */
		public static $inject = ["$scope", "$location", "taskFactory"];

		constructor (private $scope:ITaskScope, private $location:ng.ILocationService, private taskFactory:ITaskResource) {
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
				var numWeeks:number = this.$scope.frequency ? parseInt(this.$scope.frequency.name, 10) : null;
				var durationValue:number = this.$scope.durationValue;
				var durationType:string = this.$scope.durationType ? this.$scope.durationType.name : null;
				var duration:TimeLength = this.$scope.hasDuration ? new TimeLength(durationValue, durationType) : null;

				// Save the created task in the database.
				this.taskFactory.save({
					goal: goal,
					quantity: quantity,
					duration: duration,
					numWeeks: numWeeks,
					level: 1,
					completedOn: [],
					dateCreated: new Date()
				}).$promise.then(() => {
					// On successful submit
					this.reset(form);
					this.$location.url("/tasks"); // Redirect to tasks view
				});
			}
		}

		/**
		 * Resets the form to its original state.
		 * @param form The form to reset
		 */
		public reset (form:ng.IFormController):void {
			this.$scope.goal = null;
			this.$scope.quantity = null;
			this.$scope.frequency = null;
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
			var quantityIsInt:boolean = this.$scope.quantity % 1 === 0;
			var durationIsInt:boolean = this.$scope.hasDuration ? this.$scope.durationValue % 1 === 0 : true;
			return quantityIsInt && durationIsInt;
		}
	}

	/**
	 * Interface that describes the options for a drop-down select where the options are lengths of time.
	 */
	export interface Option {
		name:string;
		text:string;
	}

	/**
	 * The $scope of the Task model/view/controller.
	 */
	export interface ITaskScope extends ng.IScope {
		goal:string;
		quantity:number;
		frequency:Option;
		hasDuration:boolean;
		durationValue:number;
		durationType:Option;
		viewModel:CreateTaskController;
	}
}