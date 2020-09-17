// Convert `1.23.45-beta.6` -> `1:23:45-beta:6`
export function encode(version: string): string {
  return (version || '').replace(/\./g, ':')
}

// Convert `1:23:45-beta:6` -> `1.23.45-beta.6`
export function decode(version: string): string {
  return (version || '').replace(/\:/g, '.')
}
