# @makeswift/react

React implementation for Makeswift.

## Overview

This package provides React-specific functionality for Makeswift that is not tied to any specific React framework. It includes the ReactRuntime, base components, and hooks that are used by framework-specific adapters.

## Architecture

The React package is organized into several key areas:

- **ReactRuntime**: Core runtime for React-based Makeswift implementations
- **Components**: Base React components that can be extended by framework adapters
- **Context & Providers**: React context and providers for Makeswift functionality
- **Hooks**: React hooks for accessing Makeswift functionality

## Usage

This package is typically not used directly by end users. Instead, it serves as a foundation for framework-specific packages like `@makeswift/next` and `@makeswift/remix`.

If you're looking to integrate Makeswift with your application, you should use one of the framework-specific packages that's compatible with your React framework.