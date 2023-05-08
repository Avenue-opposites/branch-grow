<script setup lang="ts">
import type { Line, Point } from '~/types'

const canvas = ref<HTMLCanvasElement>()
const ctx = computed(() => canvas.value!.getContext('2d'))
const growTasks: Function[] = []

onMounted(() => {
  const startPoint: Point = { x: 750, y: 500 }
  step({ start: startPoint, length: random(10, 100), angle: -Math.PI / 2, color: 'gray' }, 1)
})
function step(line: Line, depth: number) {
  const { length, angle, color } = line
  const end = generateEndPoint(line)
  drawLine(line)
  if (depth >= 0 || Math.random() > 0.5) {
    const left = {
      start: end,
      length: random(10, length),
      angle: angle - Math.random(),
      color,
    }
    growTasks.push(() => step(left, depth - 1))
  }

  if (depth >= 0 || Math.random() > 0.5) {
    const right = {
      start: end,
      length: random(10, length),
      angle: angle + Math.random(),
    }
    growTasks.push(() => step(right, depth - 1))
  }
}
function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
function drawLine(line: Line) {
  const { start, color } = line
  lineTo(start, generateEndPoint(line), color)
}
function generateEndPoint(line: Line) {
  const { start, length, angle } = line
  return {
    x: start.x + length * Math.cos(angle),
    y: start.y + length * Math.sin(angle),
  }
}
function lineTo(p1: Point, p2: Point, color = '#fff') {
  const c = ctx.value!
  c.strokeStyle = color
  c.beginPath()
  c.moveTo(p1.x, p1.y)
  c.lineTo(p2.x, p2.y)
  c.stroke()
}
function frame() {
  if (!growTasks.length)
    return
  const task = [...growTasks]
  growTasks.length = 0
  task.forEach(fn => fn())
}
let count = 0
function start() {
  requestAnimationFrame(() => {
    count++
    if (count % 3 === 0)
      frame()
    start()
  })
}
start()
</script>

<template>
  <canvas ref="canvas" border :width="1500" :height="500" />
</template>
