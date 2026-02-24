import { useState, useEffect } from 'react';

const NetworkStatus = () => {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (online) return null;

  return (
    <div role="status" style={{ background: '#333', color: '#fff', textAlign: 'center', padding: '0.5rem' }}>
      You are offline. Some features may be unavailable.
    </div>
  );
};

export default NetworkStatus;
