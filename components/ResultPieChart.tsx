import {PieChart} from 'react-minimal-pie-chart'

type Props = {
  correctCount: number
  incorrectCount: number
  unanswerdCount: number
}

const HistoryTile = ({correctCount, incorrectCount, unanswerdCount}: Props) => {
  return (
    <PieChart
      startAngle={270}
      lineWidth={50}
      data={[
        {
          title: 'correct',
          value: correctCount,
          color: '#6DE3C4',
        },
        {
          title: 'incorrect',
          value: incorrectCount,
          color: '#DE7F3A',
        },
        {title: 'noanswer', value: unanswerdCount, color: '#EEEEEE'},
      ]}
    />
  )
}

export default HistoryTile
