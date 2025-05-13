/**
 * Sample page for E2E testing
 * This page should have similar/equivalent functionality to its Next.js counterpart
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
    { property: 'og:title', content: 'Makeswift Remix Sample' },
    { property: 'og:description', content: 'Testing Makeswift with Remix' },
  ];
};

// Sample component with interactive elements
export default function SamplePage() {
  const [showModal, setShowModal] = useState(false);
  const [count, setCount] = useState(0);
  
  // Toggle modal visibility
  const toggleModal = () => setShowModal(prev => !prev);
  
  // Increment counter
  const incrementCount = () => setCount(prev => prev + 1);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Makeswift + Remix Sample</h1>
        <p className="text-gray-600">This page is for E2E testing framework compatibility</p>
      </header>
      
      <main className="mb-8">
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Interactive Elements</h2>
          
          {/* Counter example */}
          <div className="bg-gray-100 p-4 rounded mb-4">
            <p className="mb-2">Counter: <span data-testid="count-value">{count}</span></p>
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={incrementCount}
              data-testid="increment-button"
            >
              Increment
            </button>
          </div>
          
          {/* Modal example */}
          <div className="bg-gray-100 p-4 rounded mb-4">
            <button 
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 show-modal"
              onClick={toggleModal}
              data-testid="modal-trigger"
            >
              Show Modal
            </button>
          </div>
          
          {/* Navigation */}
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="text-xl font-bold mb-2">Navigation</h3>
            <nav className="flex space-x-4">
              <Link to="/" className="text-blue-500 hover:underline">Home</Link>
              <Link to="/about" className="text-blue-500 hover:underline">About</Link>
              <Link to="/nonexistent" className="text-blue-500 hover:underline">404 Test</Link>
            </nav>
          </div>
        </section>
        
        {/* Content for visual comparison */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Visual Elements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="border rounded p-4 shadow">
              <h3 className="text-xl font-bold mb-2">Card 1</h3>
              <p className="mb-4">This is a sample card for visual testing</p>
              <div className="bg-red-200 w-full h-20 rounded"></div>
            </div>
            
            {/* Card 2 */}
            <div className="border rounded p-4 shadow">
              <h3 className="text-xl font-bold mb-2">Card 2</h3>
              <p className="mb-4">Another sample card for comparison</p>
              <div className="bg-blue-200 w-full h-20 rounded"></div>
            </div>
            
            {/* Card 3 */}
            <div className="border rounded p-4 shadow">
              <h3 className="text-xl font-bold mb-2">Card 3</h3>
              <p className="mb-4">A third sample card for layout testing</p>
              <div className="bg-green-200 w-full h-20 rounded"></div>
            </div>
          </div>
        </section>
        
        {/* Time/date that will be different between renders (will be ignored in tests) */}
        <div className="timestamp text-gray-400 text-sm">
          Rendered at: {new Date().toLocaleString()}
        </div>
        
        {/* Framework-specific badge */}
        <div className="framework-badge mt-4 inline-block bg-gray-800 text-white px-2 py-1 rounded text-xs">
          Remix
        </div>
      </main>
      
      {/* Modal */}
      {showModal && (
        <div className="modal fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50" onClick={toggleModal}></div>
          <div className="bg-white p-6 rounded shadow-lg z-10 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Sample Modal</h2>
            <p className="mb-4">This is a sample modal for testing interactions.</p>
            <button 
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 modal-close"
              onClick={toggleModal}
              data-testid="modal-close"
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      <footer className="border-t pt-4 text-center text-gray-600">
        &copy; {new Date().getFullYear()} Makeswift Framework Testing
      </footer>
    </div>
  );
}