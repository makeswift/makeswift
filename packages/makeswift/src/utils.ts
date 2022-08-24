export function coerceExampleToUrl(example: string) {
  if (isValidUrl(example)) {
    return example;
  }

  return `https://github.com/makeswift/makeswift/tree/main/examples/${example}`;
}

function isValidUrl(url: string) {
  try {
    return Boolean(new URL(url));
  } catch (e) {
    return false;
  }
}
