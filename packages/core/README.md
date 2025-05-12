# @makeswift/core

Core framework-agnostic functionality for Makeswift.

## Overview

This package contains the core functionality for Makeswift that is not tied to any specific framework. It provides the base interfaces, types, and utilities that are used by the framework-specific adapters.

## Architecture

The core package is organized into several key areas:

- **API Client**: Framework-agnostic client for interacting with the Makeswift API
- **Adapter Interface**: Defines the contract that framework adapters must implement
- **Site Version Management**: Utilities for handling draft/preview modes
- **Type Definitions**: Common types used across Makeswift packages

## Usage

This package is not meant to be used directly by end users. Instead, it is used as a dependency by the framework-specific packages like `@makeswift/next` and `@makeswift/remix`.

If you're looking to integrate Makeswift with your application, you should use one of the framework-specific packages instead of this core package directly.