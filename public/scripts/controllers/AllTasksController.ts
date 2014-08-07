/// <reference path="../lib/angularjs.d.ts" />
/// <reference path="../lib/moment.d.ts" />
/// <reference path="../Task.ts" />

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
			$scope.currentDate = moment().format("dddd, MMMM Do, YYYY");
			$scope.periods = [];

			$scope.allTasks.$promise.then((allTasks) => {
				allTasks.forEach((task:ITask) => {
					$scope.periods.push(AllTasksController.createPeriod(task));
				});
			});
		}

		/**
		 * Creates a representation of 1 task cycle. For example, if a task repeats every 3 weeks, a cycle is 3 weeks.
		 * @param task The task for which to generate a period
		 * @param cyclesAgo Defaults to 0 (i.e. the period that contains today's date)
		 * @returns {{task: ITask, days: DayTask[], success: boolean}} A representation of a task cycle
		 */
		public static createPeriod (task:ITask, cyclesAgo:number=0):TaskPeriod {
			var dateCreated:Moment = moment(task.dateCreated);
			var daysPerCycle:number = task.numWeeks ? task.numWeeks * 7 : 7; // default to a cycle of 1 week
			var daysSinceCreated:number = Math.floor(moment().diff(dateCreated, "seconds") / (24 * 60 * 60));
			var daysIntoCycle:number = daysSinceCreated % (daysPerCycle);
			var fromDate:Moment = moment().subtract("days", daysPerCycle * cyclesAgo);

			var period:DayTask[] = [];
			for (var i:number=0; i<=daysIntoCycle; i++) {
				var iDaysAgo:Moment = fromDate.subtract("days", i);
				period.push({day: iDaysAgo, timesCompleted: 0});
			}

			// Fill in the days with how many times the task was completed that day.
			var timesCompleted:number = 0;
			task.completedOn.forEach((date) => {
				var momentDate = moment(date);
				period.some((day:DayTask) => {
					var dayMoment:Moment = day.day;
					if (dayMoment.dayOfYear() === momentDate.dayOfYear() && dayMoment.year() === momentDate.year()) {
						timesCompleted++;
						day.timesCompleted++;
						return true;
					}
				});
			});

			var success:boolean = task.quantity && timesCompleted >= task.quantity;

			return {
				task: task,
				days: period,
				success: success
			}
		}
	}

	/**
	 * Represents how many times the task was completed on one day.
	 */
	export interface DayTask {
		day:Moment;
		timesCompleted:number;
	}

	/**
	 * Represents a period or cycle of a task and whether it was successfully completed enough times in that period.
	 */
	export interface TaskPeriod {
		task:ITask;
		days:DayTask[];
		success:boolean;
	}

	/**
	 * The $scope of the AllTasks model/view/controller.
	 */
	export interface IAllTasksScope extends ng.IScope {
		allTasks:ITask[];
		viewModel:AllTasksController;
		currentDate:string;
		periods:TaskPeriod[];
	}
}