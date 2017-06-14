# generator-danger-plugin

[![Build Status](https://travis-ci.org/macklinu/generator-danger-plugin.svg?branch=master)](https://travis-ci.org/macklinu/generator-danger-plugin)
[![npm version](https://badge.fury.io/js/generator-danger-plugin.svg)](https://badge.fury.io/js/generator-danger-plugin)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Greenkeeper badge](https://badges.greenkeeper.io/macklinu/generator-danger-plugin.svg)](https://greenkeeper.io/)

> Yeoman generator to generate a [Danger](https://github.com/danger/danger-js) plugin

## Usage

Install `yo`, this generator, and [semantic-release-cli](https://github.com/semantic-release/cli):

```sh
$ npm i -g yo generator-danger-plugin semantic-release-cli
```

Run the generator and follow the prompts to create a Danger plugin:

```sh
$ yo danger-plugin
```

This will create a new directory ready for Danger plugin development with the following technologies:

* [Babel](https://babeljs.io/) or [TypeScript](http://www.typescriptlang.org)
* [Jest](http://facebook.github.io/jest/)
* [semantic-release](https://github.com/semantic-release/semantic-release) for simple NPM package deployment from [Travis CI](https://travis-ci.org/)

Once the directory is bootstrapped and dependencies are installed (with [Yarn](https://yarnpkg.com/en/) or NPM), this generator will also globally install [semantic-release-cli](https://github.com/semantic-release/cli) and kick off that setup process for you.

## Changelog

See the GitHub [release history](https://github.com/macklinu/generator-danger-plugin/releases).

## License, Contributor's Guidelines and Code of Conduct

See [CONTRIBUTING.md](contributing.md) for more information about contributing to this project.

We try to keep as much discussion as possible in GitHub issues, but also have a pretty inactive Slack -- if you'd like an invite, ping [@Orta](https://twitter.com/orta/) a DM on Twitter with your email. It's mostly interesting if you want to stay on top of Danger without all the emails from GitHub.

> This project is open source under the MIT license, which means you have full access to the source code and can modify it to fit your own needs.
>
> This project subscribes to the [Moya Contributors Guidelines](https://github.com/Moya/contributors) which TLDR: means we give out push access easily and often.
>
> Contributors subscribe to the [Contributor Code of Conduct](http://contributor-covenant.org/version/1/3/0/) based on the [Contributor Covenant](http://contributor-covenant.org) version 1.3.0.
