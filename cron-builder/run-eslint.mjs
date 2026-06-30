import { ESLint } from 'eslint'

const eslint = new ESLint()
const results = await eslint.lintFiles(['src/'])

let hasErrors = false
for (const result of results) {
  for (const msg of result.messages) {
    const level = msg.severity === 2 ? 'Error' : 'Warning'
    console.log(`${result.filePath}:${msg.line}:${msg.column} ${level}: ${msg.message}`)
    if (msg.severity === 2) hasErrors = true
  }
}

if (hasErrors) {
  console.log('\nESLint found errors.')
  process.exit(1)
} else {
  console.log('\nESLint passed with no errors.')
}
