# Contributing to Office 365 Invoice Viewer

Thank you for your interest in contributing to the Office 365 Invoice Viewer! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- Docker and Docker Compose
- Git
- A Microsoft Azure account for testing

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/office365-invoice-viewer.git`
3. Install dependencies: `npm install && cd server && npm install`
4. Copy `.env.example` to `.env` and configure your Azure AD credentials
5. Start development environment: `docker-compose up -d db` then `npm run dev`

## 📋 How to Contribute

### Reporting Issues
- Use the GitHub issue tracker
- Check if the issue already exists
- Provide detailed information:
  - Steps to reproduce
  - Expected vs actual behavior
  - Environment details (OS, Node version, Docker version)
  - Screenshots if applicable

### Suggesting Features
- Open an issue with the "enhancement" label
- Describe the feature and its benefits
- Provide use cases and examples
- Consider implementation complexity

### Code Contributions

#### Branch Naming
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

#### Commit Messages
Follow conventional commits format:
```
type(scope): description

[optional body]

[optional footer]
```

Examples:
- `feat(auth): add multi-tenant support`
- `fix(api): resolve invoice download issue`
- `docs(readme): update installation instructions`

#### Pull Request Process
1. Create a feature branch from `main`
2. Make your changes
3. Add tests if applicable
4. Update documentation
5. Ensure all tests pass
6. Submit a pull request

## 🧪 Testing

### Running Tests
```bash
# Frontend tests (when available)
npm test

# Backend tests (when available)
cd server && npm test

# Docker container tests
docker-compose up -d
curl http://localhost:3001/health
```

### Test Guidelines
- Write unit tests for new functions
- Add integration tests for API endpoints
- Test authentication flows thoroughly
- Verify Docker container functionality

## 📝 Code Style

### JavaScript/TypeScript
- Use ESLint configuration provided
- Follow Prettier formatting
- Use TypeScript for type safety
- Prefer functional components in React

### CSS/Styling
- Use Tailwind CSS classes
- Follow mobile-first responsive design
- Maintain consistent spacing (8px grid)
- Use semantic color names

### File Organization
- Keep components small and focused
- Use descriptive file and variable names
- Group related functionality
- Maintain clear import/export structure

## 🔒 Security Guidelines

### Authentication
- Never commit credentials or secrets
- Use environment variables for configuration
- Validate all user inputs
- Implement proper error handling

### API Security
- Validate authentication tokens
- Implement rate limiting
- Use HTTPS in production
- Log security events

### Database
- Use parameterized queries
- Implement proper access controls
- Regular security updates
- Backup sensitive data

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for functions
- Document complex algorithms
- Explain business logic
- Update README for new features

### API Documentation
- Document all endpoints
- Include request/response examples
- Specify authentication requirements
- Note any breaking changes

## 🐳 Docker Guidelines

### Container Best Practices
- Use multi-stage builds
- Minimize image size
- Run as non-root user
- Include health checks

### Docker Compose
- Use environment variables
- Implement proper networking
- Configure resource limits
- Include development overrides

## 🚀 Release Process

### Version Numbering
Follow semantic versioning (SemVer):
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

### Release Checklist
- [ ] Update version numbers
- [ ] Update CHANGELOG.md
- [ ] Test Docker builds
- [ ] Verify documentation
- [ ] Create release notes
- [ ] Tag release in Git

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on the issue, not the person

### Communication
- Use clear, professional language
- Be patient with questions
- Share knowledge and resources
- Acknowledge contributions

## 📞 Getting Help

### Resources
- GitHub Issues for bugs and features
- GitHub Discussions for questions
- README.md for setup instructions
- Code comments for implementation details

### Contact
- Create an issue for project-related questions
- Use discussions for general questions
- Check existing issues before creating new ones

## 🎯 Development Priorities

### High Priority
- Security improvements
- Performance optimizations
- Bug fixes
- Documentation updates

### Medium Priority
- New features
- UI/UX improvements
- Test coverage
- Code refactoring

### Low Priority
- Nice-to-have features
- Experimental functionality
- Advanced configurations

## 📋 Checklist for Contributors

Before submitting a pull request:

- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] Commit messages follow convention
- [ ] No sensitive information in code
- [ ] Docker containers build successfully
- [ ] Feature works in both development and production
- [ ] Breaking changes are documented
- [ ] Performance impact is considered

Thank you for contributing to Office 365 Invoice Viewer! 🎉