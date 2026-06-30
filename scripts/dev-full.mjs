import { spawn } from 'node:child_process'
import process from 'node:process'

const children = []
let stopping = false

function start(label, args) {
  const child = spawn(process.execPath, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'inherit',
  })
  children.push(child)
  child.on('exit', (code, signal) => {
    if (stopping) return
    console.error(`${label} stopped (${signal || `exit ${code}`}); stopping development servers.`)
    stop(code || 1)
  })
}

function stop(exitCode = 0) {
  if (stopping) return
  stopping = true
  for (const child of children) child.kill()
  setTimeout(() => process.exit(exitCode), 100).unref()
}

process.on('SIGINT', () => stop(0))
process.on('SIGTERM', () => stop(0))

start('Backend', ['backend/server.js'])
start('Vite', ['node_modules/vite/bin/vite.js'])
