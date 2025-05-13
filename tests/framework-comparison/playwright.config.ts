import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths to our applications
const NEXTJS_APP_PATH = path.join(__dirname, '../../apps/nextjs-app-router');
const REMIX_APP_PATH = path.join(__dirname, '../../apps/remix');

// Define ports for our servers
const NEXTJS_PORT = 3000;
const REMIX_PORT = 3001;

/**
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './',
  timeout: 60000, // 60 seconds - longer timeout for loading both apps
  fullyParallel: false, // We need to control the server start/stop sequence
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Run tests serially to avoid port conflicts
  reporter: [
    ['html', { outputFolder: '../../test-results/framework-comparison/html-report' }],
    ['json', { outputFile: '../../test-results/framework-comparison/results.json' }]
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  // Define projects for each framework and viewport combination
  projects: [
    // Next.js tests - Desktop
    {
      name: 'nextjs-chrome',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${NEXTJS_PORT}`,
        // Pass metadata to identify framework in tests
        contextOptions: {
          framework: 'nextjs',
          appPath: NEXTJS_APP_PATH,
          port: NEXTJS_PORT,
        },
      },
    },
    
    // Remix tests - Desktop
    {
      name: 'remix-chrome',
      use: { 
        ...devices['Desktop Chrome'],
        baseURL: `http://localhost:${REMIX_PORT}`,
        // Pass metadata to identify framework in tests
        contextOptions: {
          framework: 'remix',
          appPath: REMIX_APP_PATH,
          port: REMIX_PORT,
        },
      },
    },
    
    // Mobile viewport tests for both frameworks
    {
      name: 'nextjs-mobile',
      use: { 
        ...devices['iPhone 13'], 
        baseURL: `http://localhost:${NEXTJS_PORT}`,
        contextOptions: {
          framework: 'nextjs',
          appPath: NEXTJS_APP_PATH,
          port: NEXTJS_PORT,
          viewport: 'mobile',
        },
      },
    },
    
    {
      name: 'remix-mobile',
      use: { 
        ...devices['iPhone 13'], 
        baseURL: `http://localhost:${REMIX_PORT}`,
        contextOptions: {
          framework: 'remix',
          appPath: REMIX_APP_PATH,
          port: REMIX_PORT,
          viewport: 'mobile',
        },
      },
    },
  ],

  // Start both development servers for testing
  webServer: [
    {
      command: `cd ${NEXTJS_APP_PATH} && pnpm dev -- -p ${NEXTJS_PORT}`,
      url: `http://localhost:${NEXTJS_PORT}`,
      reuseExistingServer: !process.env.CI,
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      command: `cd ${REMIX_APP_PATH} && pnpm dev -- --port=${REMIX_PORT}`,
      url: `http://localhost:${REMIX_PORT}`,
      reuseExistingServer: !process.env.CI,
      stdout: 'pipe',
      stderr: 'pipe',
    },
  ],
});