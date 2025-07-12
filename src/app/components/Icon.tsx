import React from 'react'

interface IconProps {
  svgContent: string
  className?: string
  size?: number // Optional size prop
  title?: string // For accessibility
}

const Icon: React.FC<IconProps> = ({ svgContent, className, size = 24, title }) => {
  if (typeof svgContent !== 'string' || !svgContent.trim().startsWith('<svg')) {
    console.error('Invalid SVG content provided to Icon component')
    return null
  }

  // Modify SVG to ensure it fills the container and inherits color
  const modifySvgContent = svgContent.replace(/<svg ([^>]+)>/, (match, p1) => {
    const width = p1.includes('width=') ? '' : `width="${size}"`
    const height = p1.includes('height=') ? '' : `height="${size}"`
    const fill = p1.includes('fill=') ? '' : 'fill="none"'
    const stroke = p1.includes('stroke=') ? '' : 'stroke="currentColor"'
    return `<svg ${p1}, ${width} ${height} ${fill} ${stroke} style="display: block;">`
  })

  const style = { width: `${size}px`, height: `${size}px` }

  return (
    <span
      className={`inline-flex items-center justify-center ${className || ''}`}
      style={style}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={!title ? true : undefined}
      dangerouslySetInnerHTML={{ __html: modifySvgContent }}
    />
  )
}

export default Icon
