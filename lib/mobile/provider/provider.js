const Template = require('../template')
const { program } = require('commander')

const changeCase = require('change-case')
const fs = require('fs')
const path = require('path')

class Provider extends Template {
  constructor() {
    super(__dirname)
    if (!fs.existsSync(path.join(process.cwd(), 'pubspec.yaml'))) {
      console.error('pubspec.yaml not found')
      process.exit(-1)
    }
  }

  command() {
  
  }
}

module.exports = new Provider()
