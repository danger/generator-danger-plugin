import { execSync } from 'child_process'

const gitConfig = (scope, property) =>
  new Promise(resolve => {
    try {
      resolve(
        execSync(`git config --${scope} ${property}`, {
          encoding: 'utf8',
        }).trim()
      )
    } catch (e) {
      resolve(null)
    }
  })

export async function defaultEmail() {
  return (
    (await gitConfig('global', 'user.email')) ||
    (await gitConfig('local', 'user.email')) ||
    Promise.resolve(null)
  )
}

export async function defaultName() {
  return (
    (await gitConfig('global', 'user.name')) ||
    (await gitConfig('local', 'user.name')) ||
    Promise.resolve(null)
  )
}

export async function defaultGitHubUsername() {
  return (await gitConfig('global', 'github.user')) || Promise.resolve(null)
}
