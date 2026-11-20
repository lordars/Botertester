# Changelog

## [Unreleased]

### Added
- Task `priority` field (`low`, `medium`, `high`) with default `medium`.
- Priority validation on create and PATCH (invalid → HTTP 422).
- Priority selector in create form, badge in task list, AND filter by priority in UI.
- Automated tests for default/valid/invalid priority, update behavior, and legacy normalization.

### Changed
- README API documentation updated to include priority.
