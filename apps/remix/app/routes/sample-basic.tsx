/**
 * Basic sample page for testing without Tailwind dependencies
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MetaFunction } from '@remix-run/react';

// Define metadata (SEO elements)
export const meta: MetaFunction = () => {
  return [
    { title: 'Sample Test Page | Makeswift Remix' },
    { name: 'description', content: 'A sample page for testing Makeswift integration with Remix' },
    { name: 'keywords', content: 'makeswift, remix, testing' },
  ];
};

// Sample component with basic styling
export default function SampleBasicPage() {
  const [showModal, setShowModal] = useState(false);
  const [count, setCount] = useState(0);
  
  // Toggle modal visibility
  const toggleModal = () => setShowModal(prev => !prev);
  
  // Increment counter
  const incrementCount = () => setCount(prev => prev + 1);
  
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 15px' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Makeswift + Remix Basic Sample
        </h1>
        <p style={{ color: '#666' }}>This is a basic page for testing without Tailwind</p>
      </header>
      
      <main style={{ marginBottom: '2rem' }}>
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Interactive Elements
          </h2>
          
          {/* Counter example */}
          <div style={{ 
            background: '#f3f4f6', 
            padding: '1rem', 
            borderRadius: '0.25rem', 
            marginBottom: '1rem'
          }}>
            <p style={{ marginBottom: '0.5rem' }}>
              Counter: <span data-testid="count-value">{count}</span>
            </p>
            <button 
              style={{ 
                background: '#3b82f6', 
                color: 'white', 
                padding: '0.5rem 1rem', 
                borderRadius: '0.25rem',
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={incrementCount}
              data-testid="increment-button"
            >
              Increment
            </button>
          </div>
          
          {/* Modal example */}
          <div style={{ 
            background: '#f3f4f6', 
            padding: '1rem', 
            borderRadius: '0.25rem', 
            marginBottom: '1rem'
          }}>
            <button 
              style={{ 
                background: '#8b5cf6', 
                color: 'white', 
                padding: '0.5rem 1rem', 
                borderRadius: '0.25rem',
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={toggleModal}
              data-testid="modal-trigger"
            >
              Show Modal
            </button>
          </div>
          
          {/* Navigation */}
          <div style={{ 
            background: '#f3f4f6', 
            padding: '1rem', 
            borderRadius: '0.25rem', 
            marginBottom: '1rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Navigation
            </h3>
            <nav style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>Home</Link>
              <Link to="/about" style={{ color: '#3b82f6', textDecoration: 'none' }}>About</Link>
              <Link to="/nonexistent" style={{ color: '#3b82f6', textDecoration: 'none' }}>404 Test</Link>
            </nav>
          </div>
        </section>
        
        {/* Content for visual comparison */}
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            Visual Elements
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {/* Card 1 */}
            <div style={{ 
              border: '1px solid #e2e8f0', 
              borderRadius: '0.25rem', 
              padding: '1rem', 
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Card 1
              </h3>
              <p style={{ marginBottom: '1rem' }}>This is a sample card for visual testing</p>
              <div style={{ 
                background: '#fecaca', 
                width: '100%', 
                height: '5rem', 
                borderRadius: '0.25rem'
              }}></div>
            </div>
            
            {/* Card 2 */}
            <div style={{ 
              border: '1px solid #e2e8f0', 
              borderRadius: '0.25rem', 
              padding: '1rem', 
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Card 2
              </h3>
              <p style={{ marginBottom: '1rem' }}>Another sample card for comparison</p>
              <div style={{ 
                background: '#bfdbfe', 
                width: '100%', 
                height: '5rem', 
                borderRadius: '0.25rem'
              }}></div>
            </div>
          </div>
        </section>
        
        {/* Time/date that will be different between renders (will be ignored in tests) */}
        <div style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
          Rendered at: {new Date().toLocaleString()}
        </div>
        
        {/* Framework-specific badge */}
        <div style={{ 
          display: 'inline-block',
          marginTop: '1rem',
          background: '#1f2937', 
          color: 'white', 
          padding: '0.25rem 0.5rem', 
          borderRadius: '0.25rem', 
          fontSize: '0.75rem'
        }}>
          Remix
        </div>
      </main>
      
      {/* Modal */}
      {showModal && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 50
        }}>
          <div style={{ 
            position: 'fixed', 
            inset: 0, 
            background: 'black', 
            opacity: 0.5 
          }} onClick={toggleModal}></div>
          <div style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '0.25rem', 
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', 
            zIndex: 10, 
            maxWidth: '28rem', 
            width: '100%'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Sample Modal
            </h2>
            <p style={{ marginBottom: '1rem' }}>This is a sample modal for testing interactions.</p>
            <button 
              style={{ 
                background: '#ef4444', 
                color: 'white', 
                padding: '0.5rem 1rem', 
                borderRadius: '0.25rem',
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={toggleModal}
              data-testid="modal-close"
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      <footer style={{ 
        borderTop: '1px solid #e2e8f0', 
        paddingTop: '1rem', 
        textAlign: 'center', 
        color: '#4b5563'
      }}>
        &copy; {new Date().getFullYear()} Makeswift Framework Testing
      </footer>
    </div>
  );
}