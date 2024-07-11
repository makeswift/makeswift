# Patch Version Release Guide for Older Versions

This guide will walk you through the steps required to perform a patch version release of an older version. Patch releases address bugs and issues in a specific version without introducing new features or breaking changes.

For example, if the latest release is version `0.19.1` and there's a bug in version `0.14.5` that needs to be fixed, you can follow these steps to create a patch release for version `0.14.5` without affecting the latest version.

## Steps to Perform a Patch Version Release for an Older Version

### 1. Checkout the Branch or Tag Corresponding to the Older Version You Want to Patch

Check out the specific version you want to patch.

```bash
git checkout @makeswift/runtime@0.14.5
```

### 2. Make the Necessary Changes

Make the required changes in your codebase to address the bug or issue that needs to be fixed.

### 3. Create a Changeset

Create a changeset to document the changes made.

```bash
pnpm changeset
```

### 4. Commit the Changes

Commit your changes with an appropriate message.

```bash
git commit -m "fix: swatch introspection on Style control"
```

### 5. Run the Changesets Version Command

Bump the package versions according to the changesets.

```bash
pnpm changeset version
```

### 6. Review the Changes

Review the changes to the package files and changelog files to ensure everything is correct.

### 7. Commit the Version Bumps

Commit the version bumps to your repository.

```bash
git commit -am "chore: version packages"
```

### 8. Publish the Packages with a Specified Tag

Publish the packages to the npm registry. **Important:** Use the `--tag` option to avoid publishing to the latest tag.

```bash
pnpm changeset publish --tag 0.14-stable
```

### 9. Push the Changes

Push the changes to your remote repository, including tags.

```bash
git push origin 0.14.6 --follow-tags
```

### 10. Verify the Release

Verify that the packages have been published successfully by checking the npm registry.
