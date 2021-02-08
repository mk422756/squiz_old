type Props = {
  max: number
  current: number
}

export default function MaxStringLength({max, current}: Props) {
  const className = current > max ? 'text-red-400 text-sm' : 'text-sm'
  return (
    <p className={className}>
      {current} / {max}
    </p>
  )
}
