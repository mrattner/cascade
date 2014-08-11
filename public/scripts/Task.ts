/// <reference path="lib/angular-resource.d.ts" />

module App {
	export interface ITask extends ng.resource.IResource<ITask> {
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
		 * After a period of how many weeks should the task be repeated?
		 */
		numWeeks:number;

		/**
		 * All tasks start at level 1. Higher level tasks are more difficult than their predecessors.
		 */
		level:number;

		/**
		 * All the Dates when this task was completed. Empty if the task has never been done.
		 */
		completedOn:Date[];

		/**
		 * When the task was created.
		 */
		dateCreated:Date;
	}

	/**
	 * Represents a length of time; for example, "2 minutes" or "1 hour."
	 */
	export class TimeLength {
		amount:number;
		time:string;

		constructor (quantity:number, type:string) {
			this.amount = quantity;
			this.time = type;
		}
	}

	export interface ITaskResource extends ng.resource.IResourceClass<ITask> {
		update (task:ITask):ITask;
	}
}