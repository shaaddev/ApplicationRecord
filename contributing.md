# Contribution Guidelines

## Introduction

Thank you for considering contributing to our project! Your help is greatly appreciated and every contribution is valuable.

## How to Contribute

### Reporting Bugs

- Search for existing issues to avoid duplicates.
- If the issue doesn't exist, open a new issue and provide detailed information.

### Suggesting Features

- Search for existing suggestions to avoid duplicates.
- If the suggestion doesn't exist, open a new issue and describe the feature in detail.

### Workflow

- Look for issues labeled "good first issue" if you're new.
- Ensure your code adheres to our coding style.
- Write clear and descriptive commit messages.
- Submit pull requests to the `main` branch.

### Setting Up Your Local Environment

1. **Copy the `.env.example` file to your .env.local**:

   ```bash
   cp .env.example .env.local
   ```

2. **Obtain your LOCAL_DATABASE_URL and insert them into the .env.local file.**:

   ```bash
   LOCAL_DATABASE_URL=your_database_url_here
   ```

   Note: _You must have PostgreSQL 14+ or later, and pgAdmin for this to work assuming you are familiar._

   _If you would like to add your own migrations, feel free to use the command below_

   ```bash
   npm run db:migrate
   ```

### Running Tests Locally

1. **Run tests to make sure your changes do not introduce new issues**:

   ```bash
   npm run build
   ```

### Submitting Pull Requests

1. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Commit your changes**:
   ```bash
   git commit -m "Add feature: your feature description"
   ```
3. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

## Communication

- For any inquiries not covered in the documentation, you can contact Rukaiah on [X](https://x.com/rukaiah_) or [LinkedIn](https://www.linkedin.com/in/rukaiah-edhah/). However, we kindly ask that you review the documentation thoroughly before reaching out
