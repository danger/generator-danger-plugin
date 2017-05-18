import assert from 'yeoman-assert'
import helpers from 'yeoman-test'
import fs from 'fs'

jest.mock('npm-name', () => () => Promise.resolve(true))
jest.mock('./values', () => ({
  defaultName: () => Promise.resolve('Git Name'),
  defaultEmail: () => Promise.resolve('git@git.com'),
  defaultGitHubUsername: () => Promise.resolve('macklinu'),
}))

function readFile(filename, json = false) {
  const file = fs.readFileSync(filename, 'utf8')
  return filename.endsWith('.json') || json ? JSON.parse(file) : file
}

describe('generator:app', () => {
  it('creates expected files', async () => {
    await helpers.run(__dirname).withPrompts({
      pluginName: 'danger-plugin-fun-time',
      description: 'Danger plugin that tells you to have a fun time',
      authorName: 'Macklin Underdown',
      authorEmail: 'email@example.com',
    })
    assert.file([
      'README.md',
      'CONTRIBUTING.md',
      'package.json',
      'CODE_OF_CONDUCT.md',
      'LICENSE.md',
      '.babelrc',
      '.editorconfig',
      '.gitignore',
      '.npmignore',
      '.esdoc.json',
      'src/index.js',
      'src/index.test.js',
      'types/index.d.ts',
      'types/test.ts',
      'types/tsconfig.json',
      'types/types.test.js',
    ])
  })
  describe('README.md', () => {
    beforeEach(async () => {
      await helpers.run(__dirname).withPrompts({
        pluginName: 'danger-plugin-fun-time',
        description: 'Danger plugin that tells you to have a fun time',
        authorName: 'Macklin Underdown',
        authorEmail: 'email@example.com',
      })
    })
    it('contains plugin name', () => {
      expect(readFile('README.md')).toMatchSnapshot()
    })
  })
  describe('src/', () => {
    beforeEach(async () => {
      await helpers.run(__dirname).withPrompts({
        pluginName: 'danger-plugin-fun-time',
        description: 'Danger plugin that tells you to have a fun time',
        authorName: 'Macklin Underdown',
        authorEmail: 'email@example.com',
      })
    })
    it('generates source file based on plugin name', async () => {
      expect(readFile('src/index.js')).toMatchSnapshot()
    })
    it('generates test file based on plugin name', async () => {
      expect(readFile('src/index.test.js')).toMatchSnapshot()
    })
  })
  describe('types/', () => {
    beforeEach(async () => {
      await helpers.run(__dirname).withPrompts({
        pluginName: 'danger-plugin-jest-test-runner',
        description: 'Danger plugin that runs Jest tests',
        authorName: 'Macklin Underdown',
        authorEmail: 'email@example.com',
      })
    })
    it('generates TypeScript type defintion', () => {
      expect(readFile('types/index.d.ts')).toMatchSnapshot()
    })
    it('generates TypeScript test file', () => {
      expect(readFile('types/test.ts')).toMatchSnapshot()
    })
  })
  describe('CODE_OF_CONDUCT.md', () => {
    it('contains author email', async () => {
      await helpers.run(__dirname).withPrompts({
        pluginName: 'danger-plugin-fun-time',
        description: 'Danger plugin that tells you to have a fun time',
        authorName: 'Macklin Underdown',
        authorEmail: 'email@example.com',
      })
      expect(readFile('CODE_OF_CONDUCT.md')).toMatchSnapshot()
    })
  })
  describe('LICENSE.md', () => {
    it('contains the current year and author name', async () => {
      Date.prototype.getUTCFullYear = jest.fn(() => 2017)
      await helpers.run(__dirname).withPrompts({
        pluginName: 'danger-plugin-fun-time',
        description: 'Danger plugin that tells you to have a fun time',
        authorName: 'Macklin Underdown',
        authorEmail: 'email@example.com',
      })
      expect(readFile('LICENSE.md')).toMatchSnapshot()
    })
  })
  describe('package.json', () => {
    it('fills package.json with correct information', async () => {
      await helpers.run(__dirname).withPrompts({
        pluginName: 'danger-plugin-fun-time',
        description: 'Danger plugin that tells you to have a fun time',
        authorName: 'Macklin Underdown',
        authorEmail: 'email@example.com',
        githubUsername: 'macklinu',
        keywords: ['fun', 'time'],
      })
      const pkg = readFile('package.json')
      expect(pkg).toMatchSnapshot()
    })
    it('uses git user.name as default name prompt value', async () => {
      await helpers.run(__dirname).withPrompts({
        pluginName: 'danger-plugin-fun-time',
        description: 'Danger plugin that tells you to have a fun time',
      })
      const pkg = readFile('package.json')
      expect(pkg.author.name).toEqual('Git Name')
    })
    it('uses git user.email as default email prompt value', async () => {
      await helpers.run(__dirname).withPrompts({
        pluginName: 'danger-plugin-fun-time',
        description: 'Danger plugin that tells you to have a fun time',
      })
      const pkg = readFile('package.json')
      expect(pkg.author.email).toEqual('git@git.com')
    })
  })
})
