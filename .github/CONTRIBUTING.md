# NOLS Developer Guide
This is a short guide on how to contribute to NOLS. Please read the document in full before submitting a pull-request.

### Testing your changes

You should update any unit tests in the `./test/index.js` file as you alter code.

Your pull-request will be ran through TravisCI and will automatically be denied by our bot, if your build does not 
pass testing & a certain coverage percentage.

There are two commands to run testing

 - `npm run build:test` which will build & run the local package to test changes manually.
 
 - `npm run test` will build & run the mocha unit tests, as well report the project codeCoverage.

### Cleaning the code

You need to run `npm run lint` to analyze the code and ensure its consistency with the repository style. Fix any errors before submitting a PR.

### 'Wrapping' Up

That's it! The only thing left to do is rigorously document the plugin and its usage. Take a look at some of the other plugins for good documentation styles.

## Commit Message Format

We have very precise rules over how our git commit messages can be formatted. This leads to more readable messages that are easy to follow when looking through the project history. But also, we use the git commit messages to generate the our change log. (Ok you got us, it's basically Angular's commit message format).

`type(scope): subject`

#### Type
Must be one of the following:

* **fix**: A bug fix
* **feat**: A new feature
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

#### Scope
The scope could be anything specifying place of the commit change.

#### Subject
The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* do not capitalize first letter
* do not place a period (.) at the end
* entire length of the commit message must not go over 50 characters
