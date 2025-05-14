Makeswift documentation: https://docs.makeswift.com/developer/app-router/installation

Documentation for project that we're working on: ./decoupling-docs

Documentation for remix (or it's called react router v7) framework: ./remix-or-react-router-docs - Please consult this document when making changes on the remix app implementation.

The packages folder contain the library/runtime that we're building.

The apps folder contains the sample implementation using the runtime.

We're starting the decoupling project. Please read all the docs first: decoupling-docs, makeswift docs, remix docs, look at the implementation in apps, and read through the makeswift runtime package to learn more things.

Keep the core package as @makeswift/runtime, the plan is to create a separate packages: @makeswift/next and
@makeswift/remix.
