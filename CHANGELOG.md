# Changelog

## [0.2.1] - 2026-05-13

### Fixed

- Manifest description now ends with a period (required by plugin review)
- Replaced internal `localStorage` access with `foldManager.savePath` to properly clear fold state and avoid cross-vault data leakage
- Replaced `setTimeout` with `activeWindow.setTimeout` for popout window compatibility
- Replaced `any` type casts with a typed `InternalApp` interface
- Removed unnecessary `as MarkdownView` type assertions
- Replaced deprecated `builtin-modules` package with Node's built-in `module.builtinModules`
- Upgraded `@typescript-eslint` to v8 and TypeScript to v6, resolving transitive CVEs in `cross-spawn`, `brace-expansion`, `js-yaml`, `minimatch`, `ajv`, `flatted`, and `picomatch`

### Documentation

- Added Installation and Usage sections to README

## [0.2.0] - 2026-05-06

### Added

- Fold/unfold properties on the active file via command palette
- Restructured notice process for clearer user feedback
- Sentence case for context menu labels and plugin description

## [0.1.0]

### Added

- Initial release
- Fold/unfold properties via right-click context menu on files and folders
