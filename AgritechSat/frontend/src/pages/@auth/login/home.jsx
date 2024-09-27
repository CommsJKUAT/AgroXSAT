import React from 'react';

const Home = ({ username }) => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome, {username}!</h1>
      <p style={styles.subtitle}>We're glad to have you here.</p>
    </div>
  );
};

// Minimal inline styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    fontSize: '36px',
    color: '#333'
  },
  subtitle: {
    fontSize: '18px',
    color: '#777'
  }
};

export default Home;
