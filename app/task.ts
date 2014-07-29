/// <reference path="../lib/moment.d.ts" />

module App
{
	class Task {
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
		 * How many times should the task be repeated?
		 */
		private repeatTimes:number;

		/**
		 * After what date should the task stop repeating?
		 */
		private endRepeat:Moment;

		/**
		 * All tasks start at level 1. Higher level tasks are more difficult than their predecessors.
		 */
		private level:number;
	}
}