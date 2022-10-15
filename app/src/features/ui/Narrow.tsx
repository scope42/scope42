/**
 * Container for page content that should not take up the whole width.
 */
export const Narrow: React.FC = ({ children }) => {
  return <div style={{ maxWidth: 1000, margin: '0 auto' }}>{children}</div>
}
