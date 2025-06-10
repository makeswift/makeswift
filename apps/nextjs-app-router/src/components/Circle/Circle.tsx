import { get } from "http";

interface Props {
  className?: string;
  color?: string;
  check?: boolean
  text?: string;
  menu?: string;
}
export function Circle({ className, color, text, check, menu}: Props) {
  return (
    <>
      <div className={className} style={{ alignContent: "center", background: color}}>
        <div>{text}</div>
        {check && <div>Check is true!</div>}
        <div>{menu}</div>
      </div>
    </>
  )
}