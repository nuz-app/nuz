// Convert `1.23.45-beta.6` -> `1:23:45-beta:6`
export const encode = (version: string) => (version || '').replace(/\./g, ':')

// Convert `1:23:45-beta:6` -> `1.23.45-beta.6`
export const decode = (version: string) => (version || '').replace(/\:/g, '.')
