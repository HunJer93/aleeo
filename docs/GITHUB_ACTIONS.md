# GitHub Actions Status Badges

Add these badges to your README.md to show the build status:

```markdown
[![CI](https://github.com/HunJer93/aleeo/actions/workflows/ci.yml/badge.svg)](https://github.com/HunJer93/aleeo/actions/workflows/ci.yml)
[![Deploy](https://github.com/HunJer93/aleeo/actions/workflows/deploy.yml/badge.svg)](https://github.com/HunJer93/aleeo/actions/workflows/deploy.yml)
[![codecov](https://codecov.io/gh/HunJer93/aleeo/branch/main/graph/badge.svg)](https://codecov.io/gh/HunJer93/aleeo)
```

## Test Coverage with SimpleCov

The project now includes comprehensive test coverage tracking using SimpleCov:

- **Coverage Reports**: Generated for both RSpec and Cucumber tests
- **Coverage Thresholds**: Set to maintain code quality
- **CI Integration**: Automatic coverage reporting in GitHub Actions
- **Multiple Formats**: HTML (local viewing) and LCOV (CI integration)

### Viewing Coverage Reports

```bash
# Run tests with coverage
./bin/test_all

# Open coverage report in browser
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
```

### Coverage Files Location

- **HTML Report**: `coverage/index.html`
- **LCOV Report**: `coverage/lcov/aleeo.lcov`
- **Configuration**: `.simplecov`

## Test Suites

The CI pipeline runs three test suites:

- **Jest Tests**: React frontend component and unit tests *(currently skipped due to Chakra UI dependency issues)*
- **RSpec Tests**: Rails backend model and request tests with SimpleCov coverage
- **Cucumber Tests**: End-to-end integration tests with SimpleCov coverage

## Running Tests Locally

```bash
# Run all tests with coverage
./bin/test_all

# Run individual test suites
RAILS_ENV=test CI=true bundle exec rspec     # Backend tests with coverage
RAILS_ENV=test COVERAGE=true bundle exec cucumber  # Integration tests with coverage
cd aleeo && npm test                         # Frontend tests (when dependencies fixed)
```

## CI/CD Pipeline

### On Pull Requests & Pushes

- ✅ Ruby security scan (Brakeman)
- ✅ Ruby code linting (RuboCop)
- ⚠️ Frontend tests (Jest) - currently skipped
- ✅ Backend tests (RSpec) with coverage
- ✅ Integration tests (Cucumber) with coverage
- 📊 Coverage reporting to Codecov

### On Main Branch

- ✅ All the above tests
- 🚀 Automated deployment (if configured)

## Coverage Configuration

The SimpleCov configuration in `.simplecov` includes:

- **Minimum Coverage**: 80% overall, 30% per file (adjust as needed)
- **Filtered Paths**: Excludes specs, config, vendor directories
- **Grouped Reports**: Models, Controllers, Services, etc.
- **Branch Coverage**: Enabled for detailed analysis

## Next Steps

1. **Configure deployment**: Update the deploy.yml workflow with your hosting configuration
2. **Fix Jest dependencies**: Resolve Chakra UI dependency issues to re-enable frontend tests
3. **Increase coverage thresholds**: Gradually raise coverage requirements as tests improve
4. **Add more tests**: Focus on files with low coverage to improve overall quality
5. **Set up Codecov**: Configure Codecov token for public coverage reporting
