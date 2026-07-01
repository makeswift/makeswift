
type Props = {
  classNameA?: string
  classNameB?: string
}

export function UseIdDemo({ classNameA, classNameB }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className={classNameA}>This div uses classNameA</div>
      <div className={classNameB}>This div uses classNameB</div>
    </div>
  )
}

export default UseIdDemo