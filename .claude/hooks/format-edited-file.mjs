import { spawnSync } from 'node:child_process'
import { isAbsolute, relative, resolve } from 'node:path'

let raw = ''
for await (const chunk of process.stdin) raw += chunk

try {
  const input = JSON.parse(raw)
  const filePath = input.tool_input?.file_path
  if (!filePath) process.exit(0)

  const projectRoot = resolve(process.env.CLAUDE_PROJECT_DIR || process.cwd())
  const target = isAbsolute(filePath) ? resolve(filePath) : resolve(projectRoot, filePath)
  const pathFromRoot = relative(projectRoot, target)

  if (pathFromRoot.startsWith('..') || isAbsolute(pathFromRoot)) process.exit(0)

  const prettierBin = resolve(projectRoot, 'node_modules/prettier/bin/prettier.cjs')
  const result = spawnSync(process.execPath, [prettierBin, '--write', '--ignore-unknown', target], {
    cwd: projectRoot,
    stdio: ['ignore', 'inherit', 'inherit'],
  })

  process.exit(result.status ?? 0)
} catch (error) {
  console.error('格式化 Hook 無法讀取輸入：', error.message)
  process.exit(1)
}