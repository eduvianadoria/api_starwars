const gulp = require('gulp')
const ts = require('gulp-typescript')
const nodemon = require('gulp-nodemon')
const JSON_FILES = ['src/*.json', 'src/**/*.json']
const mocha = require('gulp-mocha')

/** Configuração do Typescript */
const tsProject = ts.createProject('tsconfig.json')

/** Compilação Typescript */
gulp.task('compile', () => {
  const tsResult = tsProject.src()
    .pipe(tsProject())
  return tsResult.js.pipe(gulp.dest('dist'))
})

/** Copia arquivo opts dos testes unitários e integração */
gulp.task('copy-opts', () => {
  return gulp.src('tests/unit/config/mocha.opts')
    .pipe(gulp.dest('dist/tests/unit/config'))
    .pipe(gulp.dest('dist/tests/integration/config'))
})

/** Tarefa pra monitorar diretórios do projeto */
gulp.task('watch', ['compile', 'copy-opts'], () => {
  gulp.watch('src/**/*.ts', ['compile', 'copy-opts'])

  nodemon({
    script: './dist/src/server.js'
  })
})

/** Tarefa pra monitorar diretórios dos testes */
gulp.task('watch-tests', () => {
  gulp.watch('src/**/*.ts', ['compile', 'run-tests'])
  gulp.watch('tests/**/*.ts', ['compile', 'run-tests'])
})

/** Tarefa pra monitorar diretórios dos testes durante o desenvolvimento */
gulp.task('watch-tests-dev', () => {
  gulp.watch('src/**/*.ts', ['compile', 'run-tests-dev'])
  gulp.watch('tests/**/*.ts', ['compile', 'run-tests-dev'])
})

/** Tarefa que transfere arquivos json do projeto para dir de distribuição */
gulp.task('assets', function () {
  return gulp.src(JSON_FILES)
    .pipe(gulp.dest('dist'))
})

/** Tarefa que executa os testes */
gulp.task('run-tests', function () {
  return gulp.src('tests/**/*.test.ts', {read: true})
    .pipe(mocha({
      reporter: 'mochawesome',
      reporterOptions: {
        overwrite: true,
        reportTitle: 'Testes de Integração da API e de Unidade',
        autoOpen: true,
        showPassed: true,
      },
      require: ['ts-node/register'],
      slow: 5000
    }))
})

/** Tarefa que executa os testes durante o desenvolvimento */
gulp.task('run-tests-dev', function () {
  return gulp.src('tests/**/*.test.ts', {read: true})
    .pipe(mocha({
      reporter: 'spec',
      require: ['ts-node/register'],
      slow: 500000,
      timeout: 90000
    }))
})

/** Tarefa que altera a variável de ambiente NODE_ENV para development */
gulp.task('set-development-node-env', function () {
  process.env.NODE_ENV = 'development'
})

/** Tarefa que altera a variável de ambiente NODE_ENV para test */
gulp.task('set-test-node-env', function () {
  process.env.NODE_ENV = 'test'
})

/** Agrupador de tarefas */

/** tarefas default */
gulp.task('default', ['set-development-node-env', 'watch', 'assets'])

/** tarefas de testes */
gulp.task('test', ['set-test-node-env', 'watch-tests', 'run-tests'])

/** tarefas de testes para serem executadas durante o desenvolvimento */
gulp.task('test-dev', ['set-test-node-env', 'watch-tests-dev', 'run-tests-dev'])