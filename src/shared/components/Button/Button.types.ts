export type ButtonProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  children: React.ReactNode
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
  variant?:
    | 'filled'
    | 'outline'
    | 'text'
    | 'outlineBlack'
    | 'outlineBlue'
    | 'blue'
    | 'red'
    | 'green'
    | 'gray'
    | 'outlineRed'
    | 'outlineGray'
    | 'outlineGreen'
    | 'primary'
    | 'primaryOutline'
    | 'black'
  width?: 'fullWidth' | 'auto' | 'fixed'
  loading?: boolean
  title?: string
}
