/// <reference path="../lib/angularjs.d.ts" />
/// <reference path="../lib/moment.d.ts" />
/// <reference path="../Task.ts" />

module App {
	export class FakeTaskController {
		private static MAX_QUANTITY:number = 7;
		private static MAX_WEEK_INTERVAL:number = 4;
		private static MAX_DAY_INTERVAL:number = 5;
		private static MAX_DAYS_AGO:number = 100;
		private static VERBS:string[] = ["bake", "walk", "throw", "kick", "draw", "serve", "wash", "discuss", "ponder"];
		private static JOINERS:string[] = ["the", "some", "Steve's", "Anna's", "Keesha's", "Ralphie's", "my", "your"];
		private static NOUNS:string[] = ["cookies", "puppies", "milk", "hair", "socks", "poetry", "fruit", "birds"];

		/**
		 * Dependencies: The same as the parameters of the constructor.
		 * @type {string[]} The names of dependencies passed as parameters to the constructor of this class
		 */
		public static $inject = ["$scope", "taskFactory", "currentUser"];

		constructor (private $scope:IFakeTaskScope, private taskFactory:ITaskResource, private currentUser:any) {
			$scope.viewModel = this;
			$scope.currentUser = currentUser;
		}

		/**
		 * Create a fake task with a random creation date and days when it was completed.
		 */
		public createFakeTask ():void {
			var dateArray:Date[] = FakeTaskController.generateRandomDateArray();

			this.taskFactory.save({
				creator: this.$scope.currentUser._id,
				goal: FakeTaskController.randomGoal(),
				quantity: FakeTaskController.randomInt(1, FakeTaskController.MAX_QUANTITY + 1),
				duration: FakeTaskController.generateRandomDuration(),
				numWeeks: FakeTaskController.randomInt(1, FakeTaskController.MAX_WEEK_INTERVAL + 1),
				level: FakeTaskController.randomInt(1, 5),
				completedOn: dateArray,
				dateCreated: dateArray[0]
			}).$promise.then(() => {
				// On successful submit
				console.log("Fake task created");
			});
		}

		/**
		 * Generates a pseudo-random fake task name from a limited dictionary of words.
		 * @returns {string} A fake goal for the task name
		 */
		private static randomGoal ():string {
			var randomVerb:number = FakeTaskController.randomInt(0, FakeTaskController.VERBS.length);
			var randomJoiner:number = FakeTaskController.randomInt(0, FakeTaskController.JOINERS.length);
			var randomNoun:number = FakeTaskController.randomInt(0, FakeTaskController.NOUNS.length);

			var verb:string = FakeTaskController.VERBS[randomVerb];
			var joiner:string = FakeTaskController.JOINERS[randomJoiner];
			var noun:string = FakeTaskController.NOUNS[randomNoun];

			return verb + " " + joiner + " " + noun;
		}

		/**
		 * Generates a pseudo-random integer.
		 * @param min The minimum value (inclusive)
		 * @param max The maximum value (exclusive)
		 * @returns {number} An integer in the range [min, max)
		 */
		private static randomInt (min:number, max:number):number {
			return Math.floor(Math.random() * (max - min)) + min;
		}

		/**
		 * Pseudo-randomly generates a duration for the fake task.
		 * @returns {null} Either null or a TimeLength of 20 minutes
		 */
		private static generateRandomDuration ():TimeLength {
			var random:number = FakeTaskController.randomInt(0, 2);
			return random === 0 ? null : {amount: 20, time: "minutes"};
		}

		/**
		 * Pseudo-randomly generates an array of dates when the fake task was completed.
		 * @returns {Date[]} Dates starting up to MAX_DAYS_AGO days ago that are between 1 and MAX_DAY_INTERVAL days
		 * apart
		 */
		private static generateRandomDateArray ():Date[] {
			var startDate:Moment = moment(FakeTaskController.generateRandomDate());
			var dayInterval:number = FakeTaskController.randomInt(1, FakeTaskController.MAX_DAY_INTERVAL + 1);
			var dates:Date[] = [];
			var daysAgo:number = moment().diff(startDate, "days");
			for (var i:number=daysAgo; i >= 0; i -= dayInterval) {
				var date:Moment = moment().subtract(i, "days");
				dates.push(date.toDate());
			}
			return dates;
		}

		/**
		 * Pseudo-randomly generates a date.
		 * @returns {Date} A date between today and MAX_DAYS_AGO days ago
		 */
		private static generateRandomDate ():Date {
			var randomDay:number = FakeTaskController.randomInt(0, FakeTaskController.MAX_DAYS_AGO + 1);
			var date:Moment = moment().subtract(randomDay, "days");
			return date.toDate();
		}
	}

	/**
	 * The $scope of the FakeTask model/view/controller.
	 */
	export interface IFakeTaskScope extends ng.IScope {
		viewModel:FakeTaskController;
		currentUser:any;
	}
}