interface Props {
  className?: string;
}

export function Circle({ className }: Props) {
  return <div className={className}>I'm a Circle!</div>;
}