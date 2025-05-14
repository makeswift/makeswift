# @makeswift/remix

Remix adapter for Makeswift.

This package provides the integration between Makeswift's core runtime (`@makeswift/runtime`) and Remix. It handles Remix-specific implementations including:

- Resource route handlers for preview mode, webhooks, and asset serving
- Remix-specific component implementations (Link, images, etc.)
- Head management using Remix's meta exports
- Preview mode implementation using Remix's cookie and session APIs
- SSR styling with Emotion
- Integration with Remix's loader/action pattern

## Status

This package is currently under development as part of the Makeswift decoupling project. It aims to provide first-class support for using Makeswift with Remix applications.