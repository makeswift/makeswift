interface Props {
  className?: string;
}

export function Box({ className }: Props) {
  return <div className={className}>I'm a box!</div>;
}