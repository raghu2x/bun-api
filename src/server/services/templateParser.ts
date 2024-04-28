import hbs from 'handlebars'
import fs from 'fs'
import path from 'path'

const templatesDir = path.join(__dirname, '../public/templates')

export const compileTemplate = (fileName: string, data: any): string => {
  const htmlFilePath = path.join(templatesDir, fileName)
  const template = fs.readFileSync(htmlFilePath, 'utf8')

  // compile the template using handlebars
  const compiledTemplate = hbs.compile(template)

  // generate the HTML output using the compiled template and data
  const html = compiledTemplate(data)
  return html
}
