# Consolidation Testing Plan

This document outlines a comprehensive testing strategy for validating the consolidated Makeswift runtime structure.

## Testing Goals

1. Verify that the consolidated structure maintains functional equivalence with the previous implementation
2. Ensure that framework adapters properly integrate with the consolidated runtime
3. Validate that import paths work correctly throughout the codebase
4. Confirm backward compatibility for existing users

## Testing Phases

### Phase 1: Unit Testing

| Test Area | Description | Success Criteria |
|-----------|-------------|------------------|
| Core Modules | Test core modules in isolation | All core functionality behaves as expected |
| React Modules | Test React-specific modules | All React functionality behaves as expected |
| API Client | Test API client with mock adapter | Client correctly interacts with mock adapter |
| Element Renderer | Test element rendering with mock components | Elements render correctly with expected props |
| Runtime Provider | Test runtime provider and hooks | Context properly provides runtime instance |
| Store | Test state management | Store correctly manages state |

#### Core Module Tests

```typescript
// Example test for adapter interface implementation
test('adapter implementation meets interface requirements', () => {
  const mockAdapter: MakeswiftAdapter = {
    fetch: jest.fn(),
    getImageComponent: jest.fn(),
    getLinkComponent: jest.fn(),
    getSiteVersion: jest.fn(),
    renderHead: jest.fn(),
    createStyleRegistry: jest.fn(),
    resolvePagePath: jest.fn(),
  };
  
  // Verify adapter methods are callable
  mockAdapter.fetch('test', { apiKey: 'test', apiOrigin: new URL('https://test.com'), siteVersion: MakeswiftSiteVersion.Live });
  expect(mockAdapter.fetch).toHaveBeenCalled();
});
```

### Phase 2: Integration Testing

| Test Area | Description | Success Criteria |
|-----------|-------------|------------------|
| Runtime with Next.js Adapter | Test integration between runtime and Next.js adapter | Adapter correctly uses runtime functionality |
| Runtime with Remix Adapter | Test integration between runtime and Remix adapter | Adapter correctly uses runtime functionality |
| Page Rendering | Test rendering a page with real components | Page renders correctly with all components |
| API Interactions | Test API client with real adapter | API calls work as expected |
| Existing Apps | Test existing example apps with consolidated runtime | Apps work without modifications |

#### Integration Test Example

```typescript
// Example integration test for Next.js adapter
test('Next.js adapter correctly integrates with runtime', async () => {
  const runtime = new ReactRuntime({
    breakpoints: {
      mobile: { width: 480, label: 'Mobile' },
      desktop: { width: 1200, label: 'Desktop' },
    },
  });
  
  const nextAdapter = createNextAdapter();
  const client = new Makeswift('test-api-key', {
    adapter: nextAdapter,
    runtime,
  });
  
  // Mock fetch response
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({
      id: 'test-page',
      site: { id: 'test-site' },
      data: { type: 'Root', key: 'root', props: {}, children: [] },
      snippets: [],
      fonts: [],
      meta: {},
      seo: {},
      localizedPages: [],
      locale: null,
    }),
  });
  
  const snapshot = await client.getPageSnapshot('/test', {
    siteVersion: MakeswiftSiteVersion.Live,
  });
  
  expect(snapshot).not.toBeNull();
  expect(snapshot?.document.id).toBe('test-page');
});
```

### Phase 3: End-to-End Testing

| Test Area | Description | Success Criteria |
|-----------|-------------|------------------|
| Next.js Example App | Create a test app using Next.js adapter | App works with consolidated runtime |
| Remix Example App | Create a test app using Remix adapter | App works with consolidated runtime |
| Builder Interactions | Test builder mode in both examples | Builder interactions work as expected |
| Preview/Draft Mode | Test preview functionality in both examples | Preview mode works as expected |
| API Routes | Test API routes in both examples | API interactions work as expected |

#### E2E Test Workflow

1. Create a simple Next.js/Remix application using the consolidated runtime
2. Set up Cypress or Playwright tests to navigate and interact with the app
3. Verify page rendering, navigation, and interactions
4. Test preview mode and builder mode
5. Validate all Makeswift-specific functionality

### Phase 4: Migration Testing

| Test Area | Description | Success Criteria |
|-----------|-------------|------------------|
| Import Path Updates | Verify all import paths are correctly updated | No broken imports |
| Package Dependencies | Check package.json dependencies | Dependencies are correct |
| Build Process | Verify build process completes successfully | All packages build without errors |
| Type Definitions | Check TypeScript definitions | No type errors |

#### Migration Test Script

Create a script to:
1. Scan all files for imports from `@makeswift/core` and `@makeswift/react`
2. Ensure they have been updated to import from `@makeswift/runtime`
3. Verify that the build process succeeds with no errors
4. Run the type checker to ensure no type errors

## Test Execution Plan

### Development Environment Setup

```bash
# Set up testing environment
npm install -g jest cypress
npm install --save-dev jest @testing-library/react @testing-library/react-hooks

# Run unit tests
cd packages/runtime
npm test

# Run adapter tests
cd packages/next
npm test
cd packages/remix
npm test

# Run end-to-end tests
cd examples/test-app
npm run cypress
```

### Continuous Integration

Configure GitHub Actions workflow to:
1. Run all unit tests on every PR
2. Run integration tests on PRs to main branches
3. Run end-to-end tests before releases
4. Build all packages and verify no build errors

## Test Documentation

For each test suite, document:
1. Purpose of the tests
2. Setup requirements
3. Test execution steps
4. Expected results
5. Common issues and troubleshooting

## Rollback Plan

If critical issues are found during testing:
1. Maintain the existing packages until issues are resolved
2. Document any issues in a central location
3. Create a rollback script to revert import paths if needed
4. Prioritize fixing issues based on severity

## Success Criteria

The consolidation is considered successful when:
1. All unit tests pass
2. All integration tests pass
3. All end-to-end tests pass
4. Existing applications work without modification
5. New applications can be created using the consolidated structure
6. No regressions in functionality or performance

## Test Reporting

Create a test report that includes:
1. Summary of test results
2. Coverage metrics
3. Any issues found and their resolution
4. Performance benchmarks
5. Recommendations for further improvements