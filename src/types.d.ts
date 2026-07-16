declare module 'svgpath' {
  interface SvgPath {
    rotate(angle: number, cx?: number, cy?: number): SvgPath
    translate(x: number, y: number): SvgPath
    scale(sx: number, sy: number, cx?: number, cy?: number): SvgPath
    round(precision: number): SvgPath
    toString(): string
  }
  function svgpath(d: string): SvgPath
  export default svgpath
}

declare module 'react-simple-code-editor' {
  import { ComponentType, TextareaHTMLAttributes } from 'react'
  interface EditorProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    value: string
    onValueChange: (value: string) => void
    highlight: (code: string) => string | React.ReactNode
    tabSize?: number
    insertSpaces?: boolean
    ignoreTabKey?: boolean
    padding?: number
    style?: React.CSSProperties
    textareaClassName?: string
    preClassName?: string
  }
  const Editor: ComponentType<EditorProps>
  export default Editor
}
