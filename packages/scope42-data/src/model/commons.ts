import { z, ZodTypeAny } from 'zod'

/**
 * A date that can be parsed from a string. In the YAML files, dates are
 * represented by ISO strings. In the data model, we use JavaScript's native
 * `Date` class.
 */
export const DeserializableDate = z.preprocess(arg => {
  if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
}, z.date())

/**
 * Converts `null` to `undefined` before parsing. This is needed beacuse our
 * forms may produce `null`s for emtpy values. This also allows `null`s in YAML
 * files without polluting our type declarations.
 */
export function nullsafeOptional<T extends ZodTypeAny>(schema: T) {
  return z.preprocess(
    arg => (arg === null ? undefined : arg),
    schema.optional()
  )
}
