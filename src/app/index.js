import path from 'path'
import Generator from 'yeoman-generator'
import askName from 'inquirer-npm-name'
import _ from 'lodash'
import mkdirp from 'mkdirp'
import rename from 'gulp-rename'
import githubUrl from 'github-url-from-username-repo'
import chalk from 'chalk'

import fs from 'fs'

import { defaultEmail, defaultGitHubUsername, defaultName } from './values'
import * as validators from './validators'
import { defaultPackageJson } from './defaults'

const PLUGIN_PREFIX = 'danger-plugin-'

function makeGeneratorName(name) {
  name = _.kebabCase(name)
  if (!name.startsWith(PLUGIN_PREFIX)) {
    return PLUGIN_PREFIX + name
  }
  return name
}

function makePluginFunctionName(name) {
  return _.camelCase(name.substring(PLUGIN_PREFIX.length, name.length))
}

export default class extends Generator {
  initializing() {
    this.props = {}
  }

  async prompting() {
    const { pluginName } = await askName(
      {
        name: 'pluginName',
        message: 'What do you want to name your Danger plugin?',
        default: makeGeneratorName(this.appname),
        filter: makeGeneratorName,
      },
      this
    )

    const otherPromptOptions = await this.prompt([
      {
        type: 'input',
        name: 'description',
        message: 'Provide a brief description of the Danger plugin:',
        validate: validators.description,
      },
      {
        type: 'input',
        name: 'keywords',
        message: `Any additional package keywords (besides ${chalk.yellow('danger')} and ${chalk.yellow('danger-plugin')})?`,
        filter: words => words.split(/\s*,\s*/g),
      },
      {
        type: 'input',
        name: 'authorName',
        message: 'What is your full name (for npm authorship)?',
        default: async () => await defaultName(),
        store: true,
      },
      {
        type: 'input',
        name: 'authorEmail',
        message: 'What is your email (for npm authorship)?',
        default: async () => await defaultEmail(),
        store: true,
      },
      {
        type: 'input',
        name: 'githubUsername',
        message: 'What is your GitHub username?',
        default: async () => await defaultGitHubUsername(),
        store: true,
      },
      {
        type: 'confirm',
        name: 'useYarn',
        message: 'Use Yarn?',
        default: true,
        store: true,
      },
      {
        type: 'confirm',
        name: 'useTypeScript',
        message: 'Use TypeScript?',
        default: true,
        store: true,
      },
    ])

    this.props = {
      pluginName,
      ...otherPromptOptions,
    }
  }

  default() {
    if (path.basename(this.destinationPath()) !== this.props.pluginName) {
      this.log('Creating a folder for your plugin, ' + this.props.pluginName)
      mkdirp(this.props.pluginName)
      this.destinationRoot(this.destinationPath(this.props.pluginName))
    }
  }

  writing() {
    const pluginFunctionName = makePluginFunctionName(this.props.pluginName)
    const repoSlug = `${this.props.githubUsername}/${this.props.pluginName}`
    const githubBaseUrl = githubUrl(repoSlug)

    this.registerTransformStream(
      rename(path => {
        const extension = this.props.useTypeScript ? '.ts' : '.js'
        if (path.basename === 'index' && !path.extname) {
          path.extname = extension
        }

        if (path.extname === '.test') {
          path.basename += '.test'
          path.extname = extension
        }

        return path
      })
    )

    const platformProperties = {}
    if (this.props.useTypeScript) {
      platformProperties[
        'scripts'
      ] = Object.assign(defaultPackageJson.scripts, {
        build: 'tsc',
        prettier: 'prettier',
        'prettier-write': 'npm run prettier -- --parser typescript --no-semi --trailing-comma es5 --write --print-width 120',
        'prettier-project': "npm run prettier-write -- 'src/**/*.{ts,tsx}'",
        lint: 'tslint "src/**/*.ts"',
      })

      platformProperties['jest'] = {
        moduleFileExtensions: ['ts', 'tsx', 'js'],
        transform: {
          '.(ts|tsx)': '<rootDir>/node_modules/ts-jest/preprocessor.js',
        },
        testRegex: '(.test)\\.(ts|tsx)$',
        testPathIgnorePatterns: ['\\.snap$', '<rootDir>/node_modules/'],
      }

      platformProperties['devDependencies'] = Object.assign(
        {
          '@types/jest': '^19.2.4',
          '@types/node': '^12.7.12',
          danger: '*',
          'ts-jest': '^20.0.0',
          tslint: '^5.4.3',
        },
        defaultPackageJson.devDependencies
      )
      ;(platformProperties['types'] = 'dist/index.d.ts'), (platformProperties[
        'lint-staged'
      ] = {
        '*.@(ts|tsx)': ['tslint --fix', 'npm run prettier-write --', 'git add'],
      })
    } else {
      platformProperties[
        'scripts'
      ] = Object.assign(defaultPackageJson.scripts, {
        build: 'babel src --out-dir dist --ignore *.test.js',
      })

      platformProperties['devDependencies'] = Object.assign(
        {
          'babel-cli': '^6.24.1',
          'babel-jest': '^20.0.1',
          'babel-preset-env': '^1.4.0',
          'typings-tester': '^0.2.2',
        },
        defaultPackageJson.devDependencies
      )
    }

    const pkg = Object.assign(
      {
        name: this.props.pluginName,
        description: this.props.description,
        author: {
          name: this.props.authorName,
          email: this.props.authorEmail,
        },
        repository: {
          type: 'git',
          url: `${githubBaseUrl}.git`,
        },
        bugs: {
          url: `${githubBaseUrl}/issues`,
        },
        homepage: `${githubBaseUrl}#readme`,
        keywords: _.uniq(
          ['danger', 'danger-plugin'].concat(this.props.keywords || [])
        ),
      },
      defaultPackageJson,
      platformProperties
    )

    this.fs.writeJSON(this.destinationPath('package.json'), pkg)

    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      {
        ...this.props,
        pluginFunctionName,
        githubBaseUrl,
        repoSlug,
      }
    )

    this.fs.copy(
      this.templatePath('CONTRIBUTING.md'),
      this.destinationPath('CONTRIBUTING.md')
    )

    this.fs.copyTpl(
      this.templatePath('CODE_OF_CONDUCT.md'),
      this.destinationPath('CODE_OF_CONDUCT.md'),
      _.pick(this.props, ['authorEmail'])
    )

    this.fs.copyTpl(
      this.templatePath('LICENSE.md'),
      this.destinationPath('LICENSE.md'),
      {
        year: new Date().getUTCFullYear(),
        authorName: this.props.authorName,
      }
    )

    const prependDots = [
      'editorconfig',
      'gitignore',
      'esdoc.json',
      'babelrc',
      'npmignore',
      'vscode',
    ]
    prependDots.forEach(file => {
      const path = this.templatePath(file)
      if (fs.existsSync(path)) {
        this.fs.copy(path, this.destinationPath('.' + file))
      }
    })

    const moveWithoutDot = ['tsconfig.json', 'tslint.json']
    moveWithoutDot.forEach(file => {
      const path = this.templatePath(file)
      if (fs.existsSync(path)) {
        this.fs.copy(path, this.destinationPath(file))
      }
    })

    const srcOptions = {
      ...this.props,
      pluginFunctionName,
    }
    this.fs.copyTpl(
      this.templatePath('src/*'),
      this.destinationPath('src'),
      srcOptions
    )

    if (!this.props.useTypeScript) {
      this.fs.copyTpl(
        this.templatePath('types/**'),
        this.destinationPath('types'),
        { pluginFunctionName }
      )
    }
  }

  templatePath(path) {
    const sharedPath = super.templatePath('all/' + path)
    if (fs.existsSync(sharedPath)) {
      return sharedPath
    }
    const templateFolder = this.props.useTypeScript ? 'ts/' : 'js/'
    return super.templatePath(templateFolder + path)
  }

  install() {
    this.installDependencies({
      yarn: this.props.useYarn,
      npm: !this.props.useYarn,
      bower: false,
      callback: () => {
        this.log(
          '\nDependencies have been installed. ' +
            `Now run ${chalk.yellow('semantic-release-cli setup')} to finish!`
        )
      },
    })
  }
}
