import { MantineColor } from '@mantine/core'

export interface LogoProps extends React.ComponentPropsWithoutRef<'svg'> {
  color?: MantineColor
  size?: number | string
  inverted?: boolean
}
