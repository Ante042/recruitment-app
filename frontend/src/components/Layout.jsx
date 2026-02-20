import Header from './Header';
import Footer from './Footer';

/**
 * Page layout wrapper with header and footer.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content
 * @returns {JSX.Element}
 */
const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        padding: '0',
      }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
