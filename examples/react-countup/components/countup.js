import ReactCountUp from 'react-countup'

const style = {
  fontFamily: 'monospace',
  fontSize: 26,
  fontWeight: 'bold',
  textAlign: 'center'
}

export function CountUp({ suffix = '', ...restOfProps }) {
  return <ReactCountUp {...restOfProps} style={style} suffix={suffix} useEasing />
}
