type ButtonProps = {
  onClick?: any
  children?: any
  fullWidth?: boolean
  mx?: number
  color?: string
  disabled?: boolean
}

const Button = (props: ButtonProps) => {
  let className =
    'rounded-md py-2 transition duration-500 ease select-none focus:outline-none focus:shadow-outline shadow tracking-wide font-semibold'

  if (props.fullWidth === true) {
    className += ' w-full'
  } else {
    className += ` px-8`
  }

  if (props.disabled) {
    className += ' bg-blue-300 text-white'
  } else if (props.color === 'gray') {
    className += ' bg-gray-200 hover:bg-gray-300 text-gray-700'
  } else {
    className += ' bg-primary hover:bg-primary-dark text-white'
  }

  return (
    <button
      onClick={props.onClick}
      className={className}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  )
}

Button.defaultProps = {
  mx: 8,
}
export default Button
