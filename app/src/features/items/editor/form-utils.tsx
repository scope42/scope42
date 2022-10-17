import { FieldError, Merge } from 'react-hook-form'

export function getErrorMessage(
  error: Merge<FieldError, (FieldError | undefined)[]> | undefined
): string | undefined {
  if (Array.isArray(error)) {
    return error.map(e => e.message).join(', ')
  }
  return error?.message
}
