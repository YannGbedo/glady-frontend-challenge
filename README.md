# glady-frontend-challenge
This is my attempt at solving the challenge to join the Glady Team( formerly WeDooGift )

## Changes to the calculator-server

Because I never make things easy for myself - and because things usually end up easier in the long run if you take some pains
in the beginning -, I decided to take a look at the provided calculator server and make a few changes.

First of all, I wanted the possibleCombinations not to be hardcoded as a simple list, because that's rarely handled at
the database level, but rather the possibleCards which are more likely to be retrievable with a simple database query,
making this code more reusable if that's ever needed.

Also and maybe more so, I was bothered by the fact that some combinations did not exist, despite the fact that the cards
seemed to exist from other combinations. Now that might happen if there are some rules in place of which card can go
with which but that is not explicit in the exercise, but that in and of itself wouldn't be too hard to put in place as
long as the cards have more to them than just the value.

In the meantime I created some simple arbitrary rules of my own so that it's easily testable and modifiable.


Secondly, I wanted the API to send me directly the next/previous valid amounts for part 2 of the exercise so that 
I wouldn't need to ask it again for the next possible value down or up but I figured that might have been too much change
to the tools I was given for the challenge and simply worked around the issue by querying the next/previous integer
Ultimately though I would probably do that if the amounts were not simple integers.

## The mini Frontend App

I used the latest Angular version for brevity, with SASS style sheets because I'm used to them, although I kept the
styling to a minimum

## The form

I will have to use a form to have better control over what the user enters, what total money they want to spend, so 
I will be skipping ahead to level 3 and use a FormGroup

At one point just to check which method was more practical I was running two search inputs at the same time
onewith the formGroup, another a simple input I was listening to with Observables and updating with Promises
It worked well but ultimately the form is simply better suited in my current opinion.

## Level 1

1. No problem here, except I had initially missed the "and clicked on a button to validate the amount", which is why
as I mention in the files, I had originally allowed the amount and search to auto update freely as soon as the user typed

2. I'm not sure if that was asked, but even more so with the way I generated the combinations, there are times in which
multiple different combinations could lead to the same amount. I opted to show those cases to give the user more options.
In a real case, there might be more than one or two extra combination possibilities and something might need to be done
at the API level to handle those cases

3. Nothing to add here

## Level 2

As mentioned in the API section, I worked around the problem of not having a query that directly gives me next/previous
valid case by querying the next/previous integer, and updating based on the result therein.

## Personal comment

This was a pretty fun challenge. I was a little rusty on some Angular concepts so this helped me reintegrate them and
discover what Angular can do now that it couldn't a few years ago. I still like angular Material a lot, and I'm glad to
see it is probably easier to update from angular 10 to angular 15 than it was from AngularJs to Angular 5 haha.

Please do check out the code, mainly the .ts files where I've commented and made clear( I hope ) what I was doing.
I removed most of the debug console.logs but I kept the most used ones. As I mention a few times I would do things a
little different in a production development environment. These would probably go through a logging service internal
to the company.

Happy reading/testing. I thank you for the fun activity regardless of how the rest of the job application process goes.
Best regards
Yann Gbedo

# FrontendChallenge

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
