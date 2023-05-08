export interface Point {
  x: number
  y: number
}
export interface Line {
  start: Point
  length: number
  angle: number
  color?: string
}
