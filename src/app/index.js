import path from 'path'
import Generator from 'yeoman-generator'
import askName from 'inquirer-npm-name'
import _ from 'lodash'
import mkdirp from 'mkdirp'

import { defaultEmail, defaultName } from './values'
import * as validators from './validators'

const PLUGIN_PREFIX = 'danger-plugin-'

function makeGeneratorName(name) {
  name = _.kebabCase(name)
  name = name.indexOf(PLUGIN_PREFIX) === 0 ? name : PLUGIN_PREFIX + name
  return name
}

function makePluginFunctionName(name) {
  const functionName = _.camelCase(
    name.substring(PLUGIN_PREFIX.length, name.length)
  )
  return `${functionName}()`
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
        name: 'authorName',
        message: 'What is your full name (for npm authorship)?',
        default: async () => await defaultName(),
      },
      {
        type: 'input',
        name: 'authorEmail',
        message: 'What is your email (for npm authorship)?',
        default: async () => await defaultEmail(),
      },
      {
        type: 'confirm',
        name: 'useYarn',
        message: 'Use Yarn?',
        default: true,
      },
    ])

    this.props = { pluginName, ...otherPromptOptions }
  }

  default() {
    if (path.basename(this.destinationPath()) !== this.props.pluginName) {
      this.log(
        'Your generator must be inside a folder named ' +
          this.props.pluginName +
          '\n' +
          "I'll automatically create this folder."
      )
      mkdirp(this.props.pluginName)
      this.destinationRoot(this.destinationPath(this.props.pluginName))
    }
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      _.pick(this.props, [
        'pluginName',
        'description',
        'authorName',
        'authorEmail',
      ])
    )

    this.fs.copyTpl(
      this.templatePath('CODE_OF_CONDUCT.md'),
      this.destinationPath('CODE_OF_CONDUCT.md'),
      _.pick(this.props, ['authorEmail'])
    )

    this.fs.copyTpl(
      this.templatePath('LICENSE.md'),
      this.destinationPath('LICENSE.md'),
      { year: new Date().getUTCFullYear(), authorName: this.props.authorName }
    )

    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    )

    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    )

    this.fs.copy(
      this.templatePath('npmignore'),
      this.destinationPath('.npmignore')
    )

    this.fs.copy(
      this.templatePath('esdoc.json'),
      this.destinationPath('.esdoc.json')
    )

    this.fs.copy(this.templatePath('babelrc'), this.destinationPath('.babelrc'))

    this.fs.copyTpl(
      this.templatePath('src/index'),
      this.destinationPath('src/index.js'),
      { pluginFunctionName: makePluginFunctionName(this.props.pluginName) }
    )

    this.fs.copyTpl(
      this.templatePath('src/index.test'),
      this.destinationPath('src/index.test.js'),
      { pluginFunctionName: makePluginFunctionName(this.props.pluginName) }
    )
  }

  install() {
    if (this.props.useYarn) {
      this.yarnInstall()
    } else {
      this.npmInstall()
    }
  }
}
