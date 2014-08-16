/// <reference path="lib/angular-resource.d.ts" />
/// <reference path="Task.ts" />

module App {
	export interface IUser extends ng.resource.IResource<IUser> {
		/**
		 * Unique identifier for the user.
		 */
		username:string;

		/**
		 * The user's password, which will be hashed and salted when stored in the database.
		 */
		password:string;

		/**
		 * The date on which the account was created.
		 */
		dateCreated:Date;

		/**
		 * The IDs of tasks owned by this user.
		 */
		tasks:string[];
	}

	export interface IUserResource extends ng.resource.IResourceClass<IUser> {
		update (user:IUser):IUser;
	}
}