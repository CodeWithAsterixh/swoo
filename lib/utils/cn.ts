type ClassValue = string | undefined | null | boolean | Record<string, boolean> | ClassValue[]

/**
 * Custom class name joiner similar to clsx
 * Handles strings, conditionals, objects, and arrays
 * No external dependencies required
 */
export function cn(...inputs: ClassValue[]): string {
  let result = ""

  const parse = (value: ClassValue): string => {
    if (typeof value === "string") {
      return value
    }

    if (Array.isArray(value)) {
      return value.map(parse).join(" ")
    }

    if (value && typeof value === "object") {
      return Object.entries(value)
        .filter(([, val]) => val)
        .map(([key]) => key)
        .join(" ")
    }

    return ""
  }

  for (const input of inputs) {
    const parsed = parse(input)
    if (parsed) {
      result = result ? `${result} ${parsed}` : parsed
    }
  }

  return result
}