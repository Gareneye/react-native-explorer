import * as fontkit from 'fontkit'
import * as fs from 'fs'

const weights = {
  normal: '400',
  bold: '700'
}

export interface FontStyle {
  fontFamily?: string
  fontWeight?: string
  fontStyle?: string
  postscriptName?: string
}
const fonts = {}
const fontFallbacks = {}
let defaultFont = 'Proza Libre'
const svgFonts: { [key: string]: { path: string; style: FontStyle } } = {}
const usedFonts: string[] = []

export const getDefaultFont = () => defaultFont
export const setDefaultFont = (fontName: string) => (defaultFont = fontName)
export const getSvgFonts = () => svgFonts

export const registerFontUsed = (
  fontFamily: string,
  fontStyle: string = 'normal',
  fontWeight: string = 'normal'
) => {
  const key = keyFor({ fontFamily, fontWeight, fontStyle })
  if (!usedFonts.includes(key)) {
    usedFonts.push(key)
  }
}
export const getUsedFontKeys = () => usedFonts

const numberWeight = (weight) => weights[weight] || weight

const keyFor = ({ fontFamily, fontWeight, fontStyle }) =>
  `${fontFamily} (weight: ${numberWeight(fontWeight)} style: ${fontStyle})`

interface NameMatch {
  match: string
  value: string
}

const weightNames = [
  { match: 'thin', value: '100' },
  { match: 'ultra light', value: '200' },
  { match: 'light', value: '300' },
  { match: 'normal', value: '400' },
  { match: 'medium', value: '500' },
  { match: 'semi bold', value: '600' },
  { match: 'bold', value: '700' },
  { match: 'ultra bold', value: '800' },
  { match: 'heavy', value: '900' },
  { match: '100', value: '100' },
  { match: '200', value: '200' },
  { match: '300', value: '300' },
  { match: '400', value: '400' },
  { match: '500', value: '500' },
  { match: '600', value: '600' },
  { match: '700', value: '700' },
  { match: '800', value: '800' },
  { match: '900', value: '900' }
]

const italicNames = [
  { match: 'italic', value: 'italic' },
  { match: 'oblique', value: 'italic' }
]

const matchNames = (
  target: string,
  names: NameMatch[],
  defaultValue: string
): string => {
  const match = names.find((name) => target.toLowerCase().includes(name.match))
  return match ? match.value : defaultValue
}

const getFontStyle = (font, style): FontStyle => {
  const fontFamily = style.fontFamily || font.familyName
  const fontWeight =
    style.fontWeight || matchNames(font.subfamilyName, weightNames, '400')
  const fontStyle =
    style.fontStyle || matchNames(font.subfamilyName, italicNames, 'normal')

  return {
    fontFamily,
    fontWeight,
    fontStyle,
    postscriptName: style.postscriptName
  }
}

const getFontKey = (font, style) => {
  const { fontFamily, fontWeight, fontStyle } = getFontStyle(font, style)
  const key = keyFor({ fontFamily, fontWeight, fontStyle })

  if (!fontFamily || !fontWeight || !fontStyle) {
    throw new Error(`Could not find styles for font: ${key}`)
  }

  return key
}

const addFont = (font, style: FontStyle) => {
  const key = getFontKey(font, style)
  fonts[key] = font
}

export const loadFont = (fontFile, style: FontStyle = {}) => {
  const font = fontkit.create(fontFile, style.postscriptName)
  if (font.fonts) {
    font.fonts.forEach((f) => addFont(f, { fontFamily: style.fontFamily }))
  } else {
    addFont(font, style)
  }
}

export const addFontToSvg = (fontPath: string, style: FontStyle = {}) => {
  const resolvedPath = require.resolve(fontPath)
  const fontFile = fs.readFileSync(resolvedPath)
  const font = fontkit.create(fontFile, style.postscriptName)
  const key = getFontKey(font, style)
  svgFonts[key] = { path: resolvedPath, style: getFontStyle(font, style) }
  if (font.fonts) {
    font.fonts.forEach((f) => addFont(f, { fontFamily: style.fontFamily }))
  } else {
    addFont(font, style)
  }
}

export const addFontFallback = (fontFamily: string, fallback: string) => {
  fontFallbacks[fontFamily] = fallback
}

export const fontForStyle = (style, force = false) => {
  const key = keyFor(style)
  if (fonts[key]) {
    return fonts[key]
  } else if (force) {
    throw new Error(`No font defined for ${key}`)
  }

  // TODO, load font
  // loadFont(fs.readFileSync(fontDescriptor.path))

  return fontForStyle(style, true)
}

export const fontWithFallbacks = (fontFamily: string): string =>
  fontFallbacks[fontFamily]
    ? `'${fontFamily}', ${fontFallbacks[fontFamily]}`
    : `'${fontFamily}'`

// Default font family to provide for jest snapshots testing.
addFontToSvg('./font/proza-libre/ProzaLibre-Bold.ttf')
addFontToSvg('./font/proza-libre/ProzaLibre-BoldItalic.ttf')
addFontToSvg('./font/proza-libre/ProzaLibre-ExtraBold.ttf')
addFontToSvg('./font/proza-libre/ProzaLibre-ExtraBoldItalic.ttf')
addFontToSvg('./font/proza-libre/ProzaLibre-Italic.ttf')
addFontToSvg('./font/proza-libre/ProzaLibre-Light.ttf')
addFontToSvg('./font/proza-libre/ProzaLibre-LightItalic.ttf')
addFontToSvg('./font/proza-libre/ProzaLibre-Medium.ttf')
addFontToSvg('./font/proza-libre/ProzaLibre-MediumItalic.ttf')
addFontToSvg('./font/proza-libre/ProzaLibre-Regular.ttf')
addFontToSvg('./font/proza-libre/ProzaLibre-SemiBold.ttf')
addFontToSvg('./font/proza-libre/ProzaLibre-SemiBoldItalic.ttf')
