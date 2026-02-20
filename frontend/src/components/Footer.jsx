/**
 * Application footer displaying team member info.
 * @returns {JSX.Element}
 */
const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#f8f9fa',
      borderTop: '1px solid #ddd',
      padding: '1.5rem 2rem',
      textAlign: 'center',
      fontSize: '0.85rem',
      color: '#666',
    }}>
      <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600, color: '#213547' }}>Team Members</p>
      <p style={{ margin: '0.25rem 0' }}>Andreas - antf@kth.se</p>
      <p style={{ margin: '0.25rem 0' }}>Erik - eguerra@kth.se</p>
      <p style={{ margin: '0.25rem 0' }}>Lukas - lhouser@kth.se</p>
    </footer>
  );
};

export default Footer;
