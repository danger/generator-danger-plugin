import assert from 'yeoman-assert'
import helpers from 'yeoman-test'
import fs from 'fs'

jest.mock('npm-name', () => () => Promise.resolve(true))
jest.mock('./values', () => ({
  defaultName: () => Promise.resolve('Git Name'),
  defaultEmail: () => Promise.resolve('git@git.com'),
}))

function readFile(filename, json) {
  const file = fs.readFileSync(filename, 'utf8')
  return json ? JSON.parse(file) : file
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
      'package.json',
      'CODE_OF_CONDUCT.md',
      'LICENSE.md',
      '.editorconfig',
      '.gitignore',
      '.npmignore',
    ])
  })
  describe('CODE_OF_CONDUCT.md', () => {
    it('contains author email', async () => {
      await helpers.run(__dirname).withPrompts({
        pluginName: 'danger-plugin-fun-time',
        description: 'Danger plugin that tells you to have a fun time',
        authorName: 'Macklin Underdown',
        authorEmail: 'email@example.com',
      })
      assert.fileContent('CODE_OF_CONDUCT.md', 'email@example.com')
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
      assert.fileContent('LICENSE.md', /2017 Macklin Underdown/g)
    })
  })
  describe('package.json', () => {
    it('fills package.json with correct information', async () => {
      await helpers.run(__dirname).withPrompts({
        pluginName: 'danger-plugin-fun-time',
        description: 'Danger plugin that tells you to have a fun time',
        authorName: 'Macklin Underdown',
        authorEmail: 'email@example.com',
      })
      const pkg = readFile('package.json', true)
      expect(pkg).toMatchSnapshot()
    })
    it('uses git user.name as default name prompt value', async () => {
      await helpers.run(__dirname).withPrompts({
        pluginName: 'danger-plugin-fun-time',
        description: 'Danger plugin that tells you to have a fun time',
      })
      const pkg = readFile('package.json', true)
      expect(pkg.author.name).toEqual('Git Name')
    })
    it('uses git user.email as default email prompt value', async () => {
      await helpers.run(__dirname).withPrompts({
        pluginName: 'danger-plugin-fun-time',
        description: 'Danger plugin that tells you to have a fun time',
      })
      const pkg = readFile('package.json', true)
      expect(pkg.author.email).toEqual('git@git.com')
    })
  })
})
