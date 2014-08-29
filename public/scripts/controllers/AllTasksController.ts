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
		 * @returns {TaskPeriod} A representation of a task cycle
		 */
		public static createPeriod (task:ITask, cyclesAgo:number=0):TaskPeriod {
			var dateCreated:Moment = moment(task.dateCreated);
			var daysPerCycle:number = task.numWeeks ? task.numWeeks * 7 : 7; // default to a cycle of 1 week
			var daysSinceCreated:number = Math.floor(moment().diff(dateCreated, "seconds") / (24 * 60 * 60));
			var daysIntoCycle:number = daysSinceCreated % (daysPerCycle);
			var fromDate:Moment = moment().subtract(daysPerCycle * cyclesAgo, "days");

			var period:DayTask[] = [];
			for (var i:number=0; i<=daysIntoCycle; i++) {
				var iDaysAgo:Moment = moment(fromDate).subtract(i, "days");
				period.push({day: iDaysAgo, complete: false});
			}

			// Check the days on which the task was completed.
			var newPeriod:TaskPeriod = {
				task: task,
				days: period,
				success: false
			};

			newPeriod.success = AllTasksController.checkSuccess(newPeriod);

			return newPeriod;
		}

		/**
		 * Returns true if the period's task has been completed enough times.
		 * @param period A period of time with an associated task
		 * @returns {boolean} true if the task was completed the target number of times in the period
		 */
		private static checkSuccess (period:TaskPeriod):boolean {
			var timesCompleted:number = 0;
			period.task.completedOn.forEach((date) => {
				var momentDate = moment(date);
				period.days.some((day:DayTask) => {
					var dayMoment:Moment = day.day;
					if (dayMoment.dayOfYear() === momentDate.dayOfYear() && dayMoment.year() === momentDate.year()) {
						timesCompleted++;
						day.complete = true;
						return true;
					}
				});
			});

			return (period.task.quantity) && (timesCompleted >= period.task.quantity);
		}

		/**
		 * Mark a task as complete on a certain day.
		 * @param period The period associated with this task
		 * @param day The day on which the task was completed
		 * @param complete True if the task is completed; false if the task should be uncompleted
		 */
		public completeTask (period:TaskPeriod, day:Moment, complete:boolean) {
			var task:ITask = period.task;
			if (complete) {
				task.completedOn.push(day.toDate());
				this.taskFactory.update(task);
			} else {
				var i:number = -1;
				task.completedOn.some((date, index) => {
					var momentDate:Moment = moment(date);
					if (momentDate.isSame(day, "day")) {
						i = index;
						return true;
					}
				});
				if (i > -1) {
					task.completedOn.splice(i, 1);
					this.taskFactory.update(task);
				}
			}
			period.success = AllTasksController.checkSuccess(period);
		}

		/**
		 * Deletes a task from the database.
		 * @param taskId The database ID of the task to delete
		 */
		public deleteTask (taskId:string) {
			this.taskFactory.delete({id: taskId}).$promise.then(() => {
				// Remove the task from the allTasks list and the periods list.
				this.$scope.allTasks.some((task:any, index:number) => {
					if (task._id === taskId) {
						this.$scope.allTasks.splice(index, 1);
						this.$scope.periods.splice(index, 1);
						return true;
					}
				});
			});
		}
	}

	/**
	 * Represents how many times the task was completed on one day.
	 */
	export interface DayTask {
		day:Moment;
		complete:boolean;
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