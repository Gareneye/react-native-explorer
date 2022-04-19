import * as yoga from 'yoga-layout-prebuilt'

import {
  getScaledBorderRadius,
  pathForRect,
  scaleSides,
  Sides,
  sidesEqual
} from './borders'
import { $ } from './util'

export default ({ top, left, width, height }: yoga.Layout, style: any) => {
  const borderRadii = getScaledBorderRadius(style, width, height)
  const borderWidths: Sides<number> = [1, 1, 1, 1]
  const borderWidth = 1

  const attributes: any = {
    type: 'View',
    fill: style.backgroundColor || 'rgba(0, 0, 0, 0.1)',
    stroke: 'black',
    'stroke-width': borderWidth
  }

  if (sidesEqual(borderRadii)) {
    const borderRadius = borderRadii[0]
    // Offset size by half border radius, as RN draws border inside, whereas SVG draws on both sides
    return $('rect', {
      ...attributes,
      x: left + borderWidth * 0.5,
      y: top + borderWidth * 0.5,
      width: width - borderWidth,
      height: height - borderWidth,
      rx: borderRadius ? borderRadius - borderWidth * 0.5 : undefined,
      ry: borderRadius ? borderRadius - borderWidth * 0.5 : undefined
    })
  } else {
    return $('path', {
      ...attributes,
      d: pathForRect(
        left,
        top,
        width,
        height,
        borderRadii,
        scaleSides(borderWidths, 0.5)
      )
    })
  }
}
