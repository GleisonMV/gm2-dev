#!/usr/bin/env node

const { program } = require('commander')

require('./mobile/views.js')
  .command()

program
  .version('1.0.0')
  .parse(process.argv)
