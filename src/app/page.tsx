export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '2.5rem', 
        color: '#333',
        marginBottom: '20px'
      }}>
        Hop and Shop
      </h1>
      <p style={{ 
        fontSize: '1.2rem', 
        color: '#666',
        maxWidth: '600px',
        lineHeight: '1.6'
      }}>
        Our website is currently under maintenance. We'll be back soon with a better shopping experience.
      </p>
      <div style={{
        marginTop: '30px',
        fontSize: '0.9rem',
        color: '#888'
      }}>
        &copy; {new Date().getFullYear()} Hop and Shop
      </div>
    </div>
  )
} 