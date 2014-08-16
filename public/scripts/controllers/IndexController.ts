/// <reference path="../lib/angularjs.d.ts" />

module App {
	export class IndexController {
		private static ALREADY_TAKEN = "That username is already taken.";
		private static INCORRECT = "Incorrect username or password.";
		private static UNEXPECTED = "An unexpected error occurred.";
		private static ACCT_CREATED = "User created";

		/**
		 * Dependencies: The same as the parameters of the constructor.
		 * @type {string[]} The names of dependencies passed as parameters to the constructor of this class
		 */
		public static $inject = ["$scope", "$http", "$location"];

		constructor (private $scope:IIndexScope, private $http:ng.IHttpService, private $location:ng.ILocationService) {
			$scope.viewModel = this;
		}

		public submit (form:ng.IFormController):void {
			if (form.$valid) {
				var username:string = this.$scope.username;
				var password:string = this.$scope.password;

				if (this.$scope.signup) {
					this.$http.post("/users", {
						username: username,
						password: password,
						dateCreated: new Date(),
						tasks: []
					}).success(() => {
						// On successful submit
						this.reset(form);
						this.$scope.message = IndexController.ACCT_CREATED;
					}).catch((err) => {
						// Username conflict
						if (err.status === 409) {
							this.$scope.message = IndexController.ALREADY_TAKEN;
						} else {
							this.$scope.message = IndexController.UNEXPECTED;
						}
					});
				} else {
					this.$http.post("/login", {
						username: username,
						password: password
					}).success(() => {
						// On successful login
						this.reset(form);
						this.$location.url("/tasks");
					}).catch((err) => {
						// Failed authentication
						if (err.status === 401) {
							this.$scope.message = IndexController.INCORRECT;
						} else {
							this.$scope.message = IndexController.UNEXPECTED;
						}
					});
				}
			}
		}

		public reset (form:ng.IFormController):void {
			this.$scope.username = null;
			this.$scope.password = null;
			this.$scope.message = null;
			this.$scope.signup = false;
			form.$setPristine();
		}
	}

	export interface IIndexScope extends ng.IScope {
		viewModel:IndexController;
		signup:boolean;
		message:string;
		username:string;
		password:string;
	}
}