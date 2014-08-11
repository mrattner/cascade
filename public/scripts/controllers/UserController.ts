/// <reference path="../lib/angularjs.d.ts" />
/// <reference path="../User.ts" />

module App {
	export class UserController {
		/**
		 * Dependencies: The same as the parameters of the constructor.
		 * @type {string[]} The names of dependencies passed as parameters to the constructor of this class
		 */
		public static $inject = ["$scope", "$location", "userFactory"];

		constructor (private $scope:IUserScope, private $location:ng.ILocationService, private userFactory:IUserResource) {
			$scope.viewModel = this;
		}

		/**
		 * Called when the form is submitted.
		 * @param form The form whose submit action was triggered
		 */
		public submit (form:ng.IFormController):void {
			if (form.$valid) {
				var username:string = this.$scope.username;
				var password:string = this.$scope.password;

				// Save the created user in the database.
				this.userFactory.save({
					username: username,
					password: password,
					dateCreated: new Date()
				}).$promise.then(() => {
					// On successful submit
					this.reset(form);
					this.$location.url("/"); // Redirect to home
				}).catch((reason: any) => {
					if (reason.status === 409) {
						this.$scope.alreadyTaken = true;
					}
				});
			}
		}

		/**
		 * Resets the form to its original state.
		 * @param form The form to reset
		 */
		public reset (form:ng.IFormController):void {
			this.$scope.username = null;
			this.$scope.alreadyTaken = false;
			this.$scope.password = null;
			form.$setPristine();
		}
	}

	/**
	 * The $scope of the AllTasks model/view/controller.
	 */
	export interface IUserScope extends ng.IScope {
		viewModel:UserController;
		username:string;
		alreadyTaken:boolean;
		password:string;
	}
}