# Contributing

Thanks for your interest in contributing to this package! Here are some things to consider when getting started in this repo.

## Setup

* Install yarn and run `yarn install` to install dependencies.

## Development

* Use `npm link` in this folder to make `yo` use this folder for the module module: `generator-danger-plugin`.
* Ensure the babel runner is watching for changes: `yarn build -- --watch`.
* Use `yo danger-plugin` to create a new project using the dev template.

* Run tests with `yarn test`
* When committing use `yarn commit` instead of `git commit`. This will prompt you to input various fields for a [conventional commit message](https://github.com/semantic-release/semantic-release#default-commit-message-format), which semantic-release uses to determine the next package version number when deploying to NPM (major, minor, patch).
