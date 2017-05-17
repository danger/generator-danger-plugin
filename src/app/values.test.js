jest.mock('child_process')

describe('defaultEmail()', () => {
  it('returns global git user.email when present', async () => {
    const { execSync } = require('child_process')
    execSync.mockImplementation(command => {
      if (command === 'git config --global user.email') {
        return 'user@email.com'
      }
      throw Error(`Unexpected command: ${command}`)
    })

    const { defaultEmail } = require('./values')
    const email = await defaultEmail()
    expect(email).toEqual('user@email.com')
  })
  it('returns empty string when command fails', async () => {
    const { execSync } = require('child_process')
    execSync.mockImplementation(command => {
      throw Error(`Command failed`)
    })

    const { defaultEmail } = require('./values')
    const email = await defaultEmail()
    expect(email).toBeFalsy()
  })
})

describe('defaultName()', () => {
  it('returns global git user.email when present', async () => {
    const { execSync } = require('child_process')
    execSync.mockImplementation(command => {
      if (command === 'git config --global user.name') {
        return 'First Last'
      }
      throw Error(`Unexpected command: ${command}`)
    })

    const { defaultName } = require('./values')
    const name = await defaultName()
    expect(name).toEqual('First Last')
  })
  it('returns empty string when command fails', async () => {
    const { execSync } = require('child_process')
    execSync.mockImplementation(command => {
      throw Error(`Command failed`)
    })

    const { defaultName } = require('./values')
    const name = await defaultName()
    expect(name).toBeFalsy()
  })
})

describe('defaultGitHubUsername()', () => {
  it('returns global git user.email when present', async () => {
    const { execSync } = require('child_process')
    execSync.mockImplementation(command => {
      if (command === 'git config --global github.user') {
        return 'macklinu'
      }
      throw Error(`Unexpected command: ${command}`)
    })

    const { defaultGitHubUsername } = require('./values')
    const username = await defaultGitHubUsername()
    expect(username).toEqual('macklinu')
  })
  it('returns empty string when command fails', async () => {
    const { execSync } = require('child_process')
    execSync.mockImplementation(command => {
      throw Error(`Command failed`)
    })

    const { defaultGitHubUsername } = require('./values')
    const username = await defaultGitHubUsername()
    expect(username).toBeFalsy()
  })
})
