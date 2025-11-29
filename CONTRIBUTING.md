# Contributing to Geography Learning App

Thank you for your interest in the project!

## Code of Conduct

Be respectful and constructive in all interactions.

## How can I contribute?

### Reporting bugs

Open an issue with:
- Description of the problem
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots (if relevant)
- Browser/OS version

### Suggesting features

Open an issue with:
- Description of the feature
- Use case
- Mockups/wireframes (optional)

### Contributing code

1. **Fork the repository**

2. **Create a branch:**
```bash
git checkout -b feature/your-feature-name
```

3. **Make changes:**
   - Follow the existing code style
   - Add tests
   - Update documentation

4. **Run tests:**
```bash
npm test
npm run build
```

5. **Commit:**
```bash
git commit -m "Add feature: description"
```

6. **Push:**
```bash
git push origin feature/your-feature-name
```

7. **Open a Pull Request**

## Development Setup

```bash
# Clone & Install
git clone https://github.com/yourusername/geo-learner.git
cd geo-learner
npm install

# Run dev server
npm run dev

# Run tests
npm test
```

## Code Style

- TypeScript for type safety
- Svelte component conventions
- Meaningful variable names
- Comments for complex logic
- Tests for new features

## Commit Messages

Format: `type: description`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Build/config changes

Examples:
```
feat: add city mode with 50 cities
fix: correct umlaut handling in capital input
docs: update README with deployment steps
```

## Questions?

Open an issue or contact the maintainers.
