#!/usr/bin/env node
// Validate models.json against schema/models.schema.json (JSON Schema draft 2020-12).
// Run: npm run validate
import { readFileSync } from 'node:fs'
import Ajv2020 from 'ajv/dist/2020.js'
import addFormats from 'ajv-formats'

const root = new URL('..', import.meta.url)
const schema = JSON.parse(readFileSync(new URL('schema/models.schema.json', root), 'utf8'))
const data = JSON.parse(readFileSync(new URL('models.json', root), 'utf8'))

const ajv = new Ajv2020({ allErrors: true, strict: false })
addFormats(ajv)
const validate = ajv.compile(schema)

if (validate(data)) {
  console.log(`✓ models.json valid against the schema — ${data.count ?? data.models.length} models`)
} else {
  console.error(`✗ ${validate.errors.length} schema error(s):`)
  for (const e of validate.errors.slice(0, 30)) {
    console.error(`  ${e.instancePath || '/'} ${e.message}`)
  }
  process.exit(1)
}
