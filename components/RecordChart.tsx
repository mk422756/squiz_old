import {Record} from 'models/record'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import dayjs from 'dayjs'

function CustomizedAxisTick(props: any) {
  const date = dayjs(props.payload.value).date() + '日'
  return (
    <text x={props.x} y={props.y} dy={15} textAnchor="end" fill="#666">
      {date}
    </text>
  )
}

const renderLegend = (props: any) => {
  const {payload} = props

  function label(value: string) {
    let label = ''
    if (value === 'correct') {
      label = '正解'
    } else if (value === 'incorrect') {
      label = '不正解'
    }
    return label
  }

  function labelColor(value: string) {
    let color = ''
    if (value === 'correct') {
      color = 'text-success'
    } else if (value === 'incorrect') {
      color = 'text-error'
    }
    return color
  }

  return (
    <ul className="text-center">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="inline-block">
          <span className={`ml-4 ${labelColor(entry.value)}`}>
            {label(entry.value)}
          </span>
        </li>
      ))}
    </ul>
  )
}

const renderTooltip = (props: any) => {
  const {payload, active, label} = props
  const day = dayjs(label).format('YYYY年M月D日')
  if (active) {
    return (
      <div className="custom-tooltip bg-gray-50 p-2">
        <p>{day}</p>
        {payload && payload[0] && (
          <p className="text-error">不正解:{payload[0].payload.incorrect}</p>
        )}
        {payload && payload[0] && (
          <p className="text-success">正解:{payload[0].payload.correct}</p>
        )}
      </div>
    )
  }

  return null
}

export default function RecordChart({records}: {records: Record[]}) {
  return (
    <div className="bg-white">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={records}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="2 5" />
          <XAxis dataKey="date" tick={<CustomizedAxisTick />} />
          <YAxis />
          <Tooltip content={renderTooltip} />
          <Area
            type="monotone"
            dataKey="correct"
            stackId="1"
            stroke="#6DE3C4"
            fill="#6DE3C4"
          />
          <Area
            type="monotone"
            dataKey="incorrect"
            stackId="1"
            stroke="#DE7F3A"
            fill="#DE7F3A"
          />
          <Legend content={renderLegend} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
