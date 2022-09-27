export function instanceOfNodeError<T extends new (...args: any) => Error>(
  value: Error,
  errorType: T,
): value is InstanceType<T> & NodeJS.ErrnoException {
  return value instanceof errorType
}
