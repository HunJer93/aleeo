# SimpleCov configuration file
# This file provides additional configuration options for SimpleCov

# Skip SimpleCov entirely if SKIP_COVERAGE is set
unless ENV['SKIP_COVERAGE'] == 'true'
  SimpleCov.start 'rails' do
    # Coverage output directory
    coverage_dir 'coverage'

    # Files and directories to ignore
    add_filter '/bin/'
    add_filter '/db/'
    add_filter '/spec/'
    add_filter '/features/'
    add_filter '/config/'
    add_filter '/vendor/'
    add_filter '/tmp/'
    add_filter '/log/'
    add_filter '/public/'
    add_filter '/storage/'

    # Group coverage by application structure
    add_group "Models", "app/models"
    add_group "Controllers", "app/controllers"
    add_group "Services", "app/services"
    add_group "Jobs", "app/jobs"
    add_group "Mailers", "app/mailers"
    add_group "Serializers", "app/serializers"
    add_group "Concerns", "app/models/concerns"

    # Coverage thresholds - adjust as needed
    minimum_coverage 80
    minimum_coverage_by_file 30  # Start low and gradually increase
    # refuse_coverage_drop  # Comment out initially to establish baseline

    # Track branches for more detailed coverage
    enable_coverage :branch

    # CI-specific formatters
    if ENV['CI']
      require 'simplecov-lcov'
      SimpleCov::Formatter::LcovFormatter.config do |config|
        config.report_with_single_file = true
        config.single_report_path = 'coverage/lcov/aleeo.lcov'
      end

      formatter SimpleCov::Formatter::MultiFormatter.new([
        SimpleCov::Formatter::HTMLFormatter,
        SimpleCov::Formatter::LcovFormatter
      ])
    else
      # Local development - just HTML
      formatter SimpleCov::Formatter::HTMLFormatter
    end
  end
end
