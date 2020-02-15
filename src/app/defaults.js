export const defaultPackageJson = {
  version: '0.0.0-development',
  main: 'dist/index.js',
  scripts: {
    commit: 'git-cz',
    build: 'babel src --out-dir dist --ignore *.test.js',
    test: 'jest',
    predocs: 'rm -rf docs/',
    docs: 'esdoc -c .esdoc.json',
    prepare: 'npm run build',
    'semantic-release': 'semantic-release',
  },
  license: 'MIT',
  engines: {
    node: '>=10.0.0',
  },
  devDependencies: {
    commitizen: '^4.0.3',
    'cz-conventional-changelog': '^3.1.0',
    esdoc: '^1.1.0',
    'esdoc-standard-plugin': '^1.0.0',
    husky: '^4.2.3',
    jest: '^25.1.0',
    'lint-staged': '^10.0.7',
    prettier: '^1.19.1',
    'semantic-release': '^17.0.3',
    typescript: '^3.6.4',
    'validate-commit-msg': '^2.14.0',
  },
  config: {
    commitizen: {
      path: 'cz-conventional-changelog',
    },
  },
  husky: {
    hooks: {
      'commit-msg': 'validate-commit-msg',
      'pre-commit': 'lint-staged',
    },
  },
  'lint-staged': {
    '*.js': [
      'prettier --single-quote --trailing-comma=all --no-semi --write',
      'git add',
    ],
  },
}
