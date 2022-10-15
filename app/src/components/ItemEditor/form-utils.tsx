import { FieldError } from 'react-hook-form'

export function getErrorMessage(
  error: FieldError | FieldError[] | undefined
): string | undefined {
  if (Array.isArray(error)) {
    return error.map(e => e.message).join(', ')
  }
  return error?.message
}
