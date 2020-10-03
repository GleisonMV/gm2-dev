const Template = require('../template')
const { program } = require('commander')

const changeCase = require('change-case')
const fs = require('fs')
const path = require('path')

class Mobile extends Template {
  constructor() {
    super(__dirname)
    const self = this
    if (!fs.existsSync(path.join(process.cwd(), 'pubspec.yaml'))) {
      console.error('pubspec.yaml not found')
      process.exit(-1)
    }
    self.lib = path.join(process.cwd(), 'lib')
    self.types = {
      scaffold:
        self.gm('mvvm_scaffold'),
      form:
        self.gm('mvvm_form'),
      container:
        self.gm('mvvm_container'),
      list:
        self.gm('mvvm_list'),
      tabs:
        self.gm('mvv_tabs'),
      drawer: function (name, out) {
        self.template('mvvm_drawer', 'navigation', path.join(out, 'navigation.dart'), { name })
        self.template('mvvm_drawer', 'view_model', path.join(out, 'view_model.dart'), { name })
        self.template('mvvm_drawer', 'view', path.join(out, 'view.dart'), { name })
      }
    }
  }

  gm(group) {
    const self = this
    return function (name, out) {
      self.template(group, 'widget', path.join(out, 'widget.dart'), {
        name
      })
      self.template(group, 'view_model', path.join(out, 'view_model.dart'), {
        name
      })
      self.template(group, 'view', path.join(out, 'view.dart'), { name })
    }
  }

  mvvm(name, type) {
    this.ui = path.join(this.lib, 'ui')
    if (!fs.existsSync(this.ui)) {
      fs.mkdirSync(this.ui)
    }
    let paths = []
    if (name.indexOf('/') !== -1) {
      paths = name.split('/')
    } else {
      paths = [name]
    }
    let last = this.ui
    for (let i = 0; i < paths.length; i++) {
      last = path.join(last, paths[i])
      if (!fs.existsSync(last)) {
        fs.mkdirSync(last)
      }
    }
    if (type == null) {
      type = 'scaffold'
    }
    if (this.types[type] == null) {
      console.error('type not found')
      process.exit(-1)
    }
    const fn = changeCase.capitalCase(paths[paths.length - 1])
    this.types[type](fn, last)
  }

  findRoutes(refer, local, root) {
    const list = fs.readdirSync(local)
    const paths = local.split(path.sep)
    const name = paths[paths.length - 1]

    for (const dir of list) {
      const file = path.join(local, dir)
      if (fs.statSync(file).isFile() &&
        path.extname(file) === '.dart' &&
        path.basename(file, '.dart') === 'widget') {
        this.routes[root ? '/' : refer + name] = changeCase.capitalCase(name) + 'Widget'
        continue
      }
      if (fs.statSync(file).isDirectory()) {
        this.findRoutes(root ? '/' : refer + name + '/', file)
      }
    }
  }

  router() {
    this.ui = path.join(this.lib, 'ui')
    if (!fs.existsSync(this.ui)) {
      fs.mkdirSync(this.ui)
    }
    this.routes = {}
    this.findRoutes('/', this.ui, true)

    const keys = []
    const imports = []
    for (const key in this.routes) {
      keys.push(`'${key}': (context) => ${this.routes[key]}()`)
      imports.push(key.substr(1) + '/widget.dart')
    }
    this.template('router', 'router', path.join(this.ui, 'router.dart'), {
      keys,
      imports
    })
  }

  command() {
    program
      .command('mvvm <name> [type]')
      .description('create mvvm')
      .action((name, type) => this.mvvm(name, type))

    program
      .command('router')
      .description('create router.dart')
      .action(() => this.router())
  }
}

module.exports = new Mobile()
