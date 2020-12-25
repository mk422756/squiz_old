const Button = (props) => {
  return (
    <button
      onClick={props.onClick}
      className="border border-primary bg-primary text-white rounded-md px-8 py-2 transition duration-500 ease select-none hover:bg-primary-dark focus:outline-none focus:shadow-outline shadow tracking-wide"
    >
      {props.children}
    </button>
  )
}

export default Button
