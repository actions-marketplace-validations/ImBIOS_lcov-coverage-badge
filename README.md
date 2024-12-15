# LCOV Coverage Badge for GitHub Repositories

## Overview

This GitHub Action allows you to create and display a **dynamic code coverage badge** in your repository's README.md file, based on LCOV data files generated by **Bazel**. It helps you track your repository's **code health** and **test coverage** with a simple and efficient process.

## Why do you use this action?

Finding a clean solution for generating **coverage badges** from **LCOV data** wasn't easy, so I created this tool to streamline the process for my repositories. This GitHub Action is designed to automatically generate an **LCOV coverage badge** from the **Bazel coverage output** and embed it directly into your project’s README.md or other markdown files.

By using this action, you'll gain instant insights into your **test coverage percentage** and be able to monitor the **quality of your code** at a glance.

This project is inspired by **schneegans/dynamic-badges-action** but is tailored specifically to evaluate **LCOV data format**, download badges from **badges.io**, and save them directly to your repository as **coverage.svg**.

## Setup Guide

### Step 1: Update Build File

To prevent unnecessary builds, ensure you add the following to your build configuration:

```yaml
on:
  push:
    branches:
      - main
    paths-ignore:
      - "**/coverage.svg"
  pull_request:
```

> **Important:** Adding this ignore rule prevents a build loop. Make sure to include this step in your CI/CD pipeline.

### Step 2: Add GitHub Action to Your Workflow

Add a step in your GitHub Actions workflow to execute the badge creation action. Here's the setup:

```yaml
...
steps:
  - uses: ImBIOS/lcov-coverage-badge@v1
    with:
      file: ./target/coverage.dat
```

### Step 3: Embed the Badge in Your README.md

Once the badge is generated and saved as `coverage.svg`, you can add it to your README.md (or other markdown files) using the following syntax:

```markdown
![coverage](coverage.svg)
```

Example:

![coverage](coverage.svg)

### Full Configuration Example

```yaml
...
steps:
- uses: ImBIOS/lcov-coverage-badge@v1
  with:
    file: ./target/coverage.dat
    access_token: ${{ secret.COVERAGE_TOKEN }}
    style: flat
    icon_name: googlecloud
    icon_color: 'ffffff'
    label: 'Coverage'
    label_color: 'ffffff'
    critical: 60
    criticalColor: '9c2c9c'
    warning: 75
    warningColor: 'd68f0c'
    success_color: '43ad43'
    message_color: 'ffffff'
```

## Output Variables

The GitHub Action provides the following output variables:

- **coverage_functions_found**: Total number of functions found.
- **coverage_functions_hit**: Total number of functions hit (any > 0).
- **coverage_lines_found**: Total line count.
- **coverage_lines_hit**: Total lines hit (any > 0).
- **coverage_score**: The score is calculated as lines hit / lines found.
- **coverage_badge_url**: The URL used to generate the badge.

## Benefits of Using LCOV for Coverage Badges

- **Visualize Code Coverage**: Easily track test coverage for your project.
- **Dynamic Badge Updates**: Automatically update the coverage badge based on your latest tests.
- **LCOV Compatibility**: Directly integrates with **Bazel** and **LCOV** output files.

## License

This project is released under the **Apache 2.0** license. For more information, read the [License File](./LICENSE) or visit the official [Apache 2 License](https://www.apache.org/licenses/LICENSE-2.0).

## Keywords for SEO

- **LCOV coverage badge**
- **dynamic coverage badge**
- **GitHub Actions**
- **Bazel code coverage**
- **test coverage badge**
- **CI/CD pipeline**
- **code health monitoring**
- **automated test coverage badge**
- **LCOV data format**
