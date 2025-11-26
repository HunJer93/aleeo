# GitHub Actions Status Badges

Add these badges to your README.md to show the build status:

```markdown
[![CI](https://github.com/HunJer93/aleeo/actions/workflows/ci.yml/badge.svg)](https://github.com/HunJer93/aleeo/actions/workflows/ci.yml)
[![Deploy](https://github.com/HunJer93/aleeo/actions/workflows/deploy.yml/badge.svg)](https://github.com/HunJer93/aleeo/actions/workflows/deploy.yml)
```

## Test Coverage

The CI pipeline runs three test suites:

- **Jest Tests**: React frontend component and unit tests
- **RSpec Tests**: Rails backend model and request tests  
- **Cucumber Tests**: End-to-end integration tests

## Running Tests Locally

```bash
# Run all tests
./bin/test_all

# Run individual test suites
bundle exec rspec                    # Backend tests
bundle exec cucumber               # Integration tests
cd aleeo && npm test              # Frontend tests
```

## CI/CD Pipeline

### On Pull Requests & Pushes

- ✅ Ruby security scan (Brakeman)
- ✅ Ruby code linting (RuboCop)
- ✅ Frontend tests (Jest)
- ✅ Backend tests (RSpec)
- ✅ Integration tests (Cucumber)

### On Main Branch

- ✅ All the above tests
- 🚀 Automated deployment (if configured)

## Next Steps

1. **Configure deployment**: Update the deploy.yml workflow with your hosting configuration
2. **Add test coverage badges**: Consider using Codecov or similar service
3. **Add environment-specific deployments**: Create staging/production environments
4. **Add database seeding**: Include sample data setup in CI
