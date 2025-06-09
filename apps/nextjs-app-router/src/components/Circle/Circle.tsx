interface Props {
  className?: string;
  color?: string;
}

export function Circle({ className, color }: Props) {
  return <div className={className} style={{ background: color }}>I'm a Circle!</div>;
}