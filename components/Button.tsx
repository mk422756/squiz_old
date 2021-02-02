import ReactLoading from 'react-loading'

type ButtonProps = {
  onClick?: any
  children?: any
  fullWidth?: boolean
  mx?: number
  color?: string
  disabled?: boolean
  loading?: boolean
}

const Button = (props: ButtonProps) => {
  let className =
    'relative rounded-md py-2 transition duration-500 ease select-none shadow tracking-wide font-semibold'

  if (props.fullWidth === true) {
    className += ' w-full'
  } else {
    className += ` px-8`
  }

  if (props.disabled && props.color === 'gray') {
    className += ' bg-gray-100 '
  } else if (props.disabled) {
    className += ' bg-blue-300 text-white'
  } else if (props.color === 'gray') {
    className +=
      ' bg-gray-200 hover:bg-gray-300 text-gray-700 focus:outline-none focus:shadow-outline'
  } else {
    className +=
      ' bg-primary hover:bg-primary-dark text-white focus:outline-none focus:shadow-outline'
  }

  return (
    <button
      onClick={props.onClick}
      className={className}
      disabled={props.disabled}
    >
      {props.loading && (
        <div className="absolute left-2 top-2">
          <ReactLoading type="spin" height={22} width={22} />
        </div>
      )}
      <span className="ml-2">{props.children}</span>
    </button>
  )
}

Button.defaultProps = {
  mx: 8,
}
export default Button
