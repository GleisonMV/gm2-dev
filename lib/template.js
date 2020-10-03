const fs = require('fs')
const path = require('path')
const mustache = require('mustache')

class Template {
  constructor (base) {
    this.base = base
  }

  template (group, name, out, options) {
    fs.writeFileSync(out,
      mustache.render(
        fs.readFileSync(
          path.join(this.base, 'template', group, name + '.mustache')
        ).toString(), options
      )
    )
  }

  command () { }
}

module.exports = Template
