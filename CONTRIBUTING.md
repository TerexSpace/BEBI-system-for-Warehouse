# Contributing to DIM-Weight-ERP

Thank you for your interest in contributing to DIM-Weight-ERP! This document provides guidelines for contributing to the project.

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## How to Report Bugs

### Before Submitting a Bug Report

- **Check the issue tracker** to see if the bug has already been reported
- **Verify your environment**: Check Node.js version (18+), Python version (3.9+), and npm version
- **Enable debug mode**: Set `LOG_LEVEL=debug` to gather more information
- **Test reproducibility**: Verify the bug occurs consistently with the provided steps

### Submitting a Bug Report

When submitting a bug report, please include:

1. **Description**: Clear, concise description of the bug
2. **Reproduction Steps**: Exact steps to reproduce the issue
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Environment**: Node.js version, Python version, OS, npm version
6. **Logs**: Relevant error messages and stack traces
7. **Attachments**: Screenshots or test files if relevant

## How to Suggest Enhancements

### Before Submitting an Enhancement Suggestion

- **Check existing issues** to see if your enhancement has been suggested
- **Verify alignment**: Ensure the enhancement aligns with the project's goals

### Submitting an Enhancement Suggestion

When submitting an enhancement, please include:

1. **Summary**: Clear description of the enhancement
2. **Use Case**: Explain the use case and benefits
3. **Implementation**: Suggest possible implementation approaches if applicable
4. **References**: Links to related issues or papers

## Development Workflow

### Setting Up Your Development Environment

```bash
# Clone the repository
git clone https://github.com/yourusername/dim-weight-erp.git
cd dim-weight-erp

# Install dependencies
npm run setup

# Create a feature branch
git checkout -b feature/your-feature-name
```

### Code Style Guide

#### JavaScript/Node.js

- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use 2-space indentation
- Use `const` by default, `let` when necessary, avoid `var`
- Use meaningful variable and function names
- Add JSDoc comments for public functions

#### Python

- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/)
- Use 4-space indentation
- Add docstrings to all functions and classes
- Type hints are recommended for new code
- Use meaningful variable and function names

#### Go/Chaincode

- Follow [Effective Go](https://golang.org/doc/effective_go)
- Use `gofmt` for formatting
- Add comments for all public functions and types
- Use meaningful names for variables and functions

### Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line
- Write clear, descriptive commit messages

Example:

```
Add tariff calculation endpoint

Implement POST /api/warehouse/tariffs/calculate endpoint with:
- Support for weight-based tariffs
- Calculation validation
- Comprehensive error handling

Fixes #123
```

### Testing

Before submitting a pull request:

```bash
# Run all tests
npm test

# Check test coverage
npm test -- --coverage

# Run specific test file
npm test -- tests/routes_extended.test.js

# Run tests in watch mode during development
npm test -- --watch
```

### Documentation

- Update README.md if your changes affect user-facing features
- Add docstrings to all new functions
- Update API documentation in docs/API.md if you modify API endpoints
- Include examples for new features

## Pull Request Process

### Before Submitting

1. Update the README.md with details of changes to user-facing features
2. Update documentation for new or changed APIs
3. Increase version numbers following [Semantic Versioning](https://semver.org/)
4. Ensure all tests pass: `npm test`
5. Ensure code style compliance
6. Rebase on the latest main branch

### Submitting a Pull Request

1. Push your changes to your fork
2. Create a pull request against the `main` branch
3. Fill out the pull request template completely
4. Reference any related issues
5. Request review from maintainers

### Pull Request Template

```markdown
## Description
Brief description of what this PR does.

## Related Issues
Fixes #(issue number)

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update

## Testing
- [ ] All tests pass (`npm test`)
- [ ] Added new tests for new functionality
- [ ] Manual testing completed

## Documentation
- [ ] README updated if needed
- [ ] API documentation updated if needed
- [ ] Code comments/docstrings added

## Checklist
- [ ] My code follows the code style guidelines
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
```

## Review Process

- At least one maintainer review is required
- All CI checks must pass
- Code coverage should not decrease
- Discussions may be requested for significant changes

## Release Process

The maintainers use semantic versioning for releases:

- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards-compatible)
- **PATCH**: Bug fixes

## Community

- **Issue Discussions**: Use GitHub issues for bug reports and feature requests
- **Security Issues**: Email security concerns privately to the maintainers
- **Documentation**: Help improve docs by submitting documentation PRs
- **Code Review**: Review open PRs and provide constructive feedback

## Additional Resources

- [Project Documentation](./docs/)
- [API Documentation](./docs/API.md)
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Hyperledger Fabric Documentation](https://hyperledger-fabric.readthedocs.io/)
- [XGBoost Documentation](https://xgboost.readthedocs.io/)

## Questions?

- Open an issue on GitHub
- Check existing documentation
- Review closed issues for solutions to common problems

Thank you for contributing to DIM-Weight-ERP!
