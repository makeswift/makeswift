// Test script to be run in the browser
// Add this inside the main-fixed.tsx file to debug client-side rendering

(function() {
  // Log that client-side code is executing
  console.log('Client-side test script running');
  
  // Function to test our components directly
  window.testMakeswiftComponents = function() {
    try {
      console.log('Testing Makeswift components...');
      
      const SimpleText = window.SimpleText;
      const ContentCard = window.ContentCard;
      
      if (!SimpleText || !ContentCard) {
        console.error('Components not found on window');
        return false;
      }
      
      console.log('Component test successful!');
      return true;
    } catch (err) {
      console.error('Error testing components:', err);
      return false;
    }
  };
  
  // Function to manually trigger rendering
  window.renderTestContent = function() {
    try {
      console.log('Rendering test content...');
      
      // Get the root element
      const root = document.getElementById('root');
      if (!root) {
        console.error('Root element not found');
        return;
      }
      
      // Create a test element
      const testDiv = document.createElement('div');
      testDiv.id = 'test-content';
      testDiv.style.padding = '2rem';
      testDiv.style.maxWidth = '600px';
      testDiv.style.margin = '0 auto';
      testDiv.style.border = '2px solid #bae6fd';
      testDiv.style.borderRadius = '0.5rem';
      testDiv.innerHTML = '<h2>Test Content</h2><p>If you can see this, the client-side rendering is working.</p>';
      
      // Append to body
      document.body.appendChild(testDiv);
      
      console.log('Test content rendered successfully');
      return true;
    } catch (err) {
      console.error('Error rendering test content:', err);
      return false;
    }
  };
  
  // Auto-run tests
  setTimeout(() => {
    console.log('Auto-running tests...');
    window.renderTestContent();
  }, 1000);
})();