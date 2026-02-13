import Header from './Header';
import Footer from './Footer';

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
