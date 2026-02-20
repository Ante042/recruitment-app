import { Link } from 'react-router-dom';

/**
 * Application header with navigation link.
 * @returns {JSX.Element}
 */
const Header = () => {
  return (
    <header style={{
      backgroundColor: '#213547',
      color: 'white',
      padding: '1rem 2rem',
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '1.25rem' }}>
        Recruitment Application
      </Link>
    </header>
  );
};

export default Header;
