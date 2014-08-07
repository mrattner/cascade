# Cascade

Inspired by twynsicle's [Cascade](https://github.com/twynsicle/Cascade), this app will help a user track good habits
over periods of time. The client-side code is written in [Typescript](http://www.typescriptlang.org/) using [Angular JS](https://angularjs.org/).
The server side is Node JS using Express, with a MongoDB data store.

## What will make this app different from other habit-tracking apps?

Most habit-tracking apps tend to track by a calendar, with tasks occurring every day, every other day, every weekday,
or X times per calendar week. Sometimes one would prefer to track a habit that should be done once every X days, rather
than "every Monday, Wednesday and Friday," for example. Cascade will keep track of your habits as a continuous flow of
cycles that you define, instead of breaking them up by calendar weeks and months.

## Examples of Cascade tasks

* Exercise for 20 minutes 5 times per week
* Get 8 hours of sleep 7 times per week
* Balance budget once every 4 weeks

## Leveling up

At any time you can Level Up a task to make it harder or closer to your ultimate goal. Cascade will visually reflect the
task's higher level so that you can feel a greater sense of accomplishment as you level up your tasks. Other tasks will
naturally not have levels, but they are still part of the flow of your life, so Cascade will consider them to be just as
important.

## Work in progress

Cascade is not finished. It is just started. We aren't even up to version 0.1. I just wanted to keep track of the
app from its bare-bones beginnings and see how far I can get. Once the app has all of the basic functionality, this
readme will contain instructions for using it.

### How to run the development version

You must have Node, NPM, and MongoDB installed, as well as the Typescript compiler `tsc`.

1. Download the zip or clone the repository to your local system.
2. Run `npm install` in the download directory.
3. Run `tsc` on all the `.ts` files in the `public/scripts` and `public/scripts/controllers` directories.
4. Run `mongod --dbpath /path/to/Cascade/models/data` in a separate terminal window. Make sure the instance of MongoDB
is running locally on port `27017`.
5. Run `npm start` in the download directory.
6. Access the app by opening `http://localhost:3000` in your web browser.