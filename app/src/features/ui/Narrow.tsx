/**
 * Container for page content that should not take up the whole width.
 */
export const Narrow: React.FC<{ children: React.ReactNode }> = props => {
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>{props.children}</div>
  )
}
