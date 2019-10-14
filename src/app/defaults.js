export const defaultPackageJson = {
  version: '0.0.0-development',
  main: 'dist/index.js',
  scripts: {
    precommit: 'lint-staged',
    commit: 'git-cz',
    commitmsg: 'validate-commit-msg',
    build: 'babel src --out-dir dist --ignore *.test.js',
    test: 'jest',
    predocs: 'rm -rf docs/',
    docs: 'esdoc -c .esdoc.json',
    prepublish: 'npm run build',
    'semantic-release': 'semantic-release pre && npm publish && semantic-release post',
  },
  license: 'MIT',
  engines: {
    node: '>=4.0.0',
  },
  devDependencies: {
    commitizen: '^2.9.6',
    'cz-conventional-changelog': '^2.0.0',
    husky: '^0.13.3',
    jest: '^20.0.1',
    'lint-staged': '^3.4.1',
    prettier: '^1.3.1',
    'semantic-release': '^6.3.6',
    typescript: '^3.6.4',
    'validate-commit-msg': '^2.12.1',
  },
  optionalDependencies: {
    esdoc: '^0.5.2',
  },
  config: {
    commitizen: {
      path: 'cz-conventional-changelog',
    },
  },
  'lint-staged': {
    '*.js': [
      'prettier --single-quote --trailing-comma=all --no-semi --write',
      'git add',
    ],
  },
}
