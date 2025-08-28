# Project Setup Guide

This guide provides detailed setup instructions for the Next.js application, including environment configuration, development tools, and deployment preparation.

## Prerequisites

### Required Software
- **Node.js**: 18.17 or later
- **npm**: 8.0 or later (or yarn/pnpm)
- **Git**: For version control
- **Docker**: For containerized development (optional)

### Recommended Tools
- **VS Code**: With TypeScript and React extensions
- **Postman/Insomnia**: For API testing
- **Chrome DevTools**: For debugging

## Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd shadcn-landing
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Your App Name"

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_API_TIMEOUT=10000

# Authentication (if needed)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Database (if needed)
DATABASE_URL=your-database-url

# External Services
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

### 4. Verify Installation
```bash
# Check TypeScript compilation
npm run type-check

# Run linting
npm run lint

# Start development server
npm run dev
```

## Development Environment

### VS Code Configuration
Create `.vscode/settings.json`:

```json
{
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "typescript.suggest.autoImports": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### Recommended Extensions
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Prettier - Code formatter
- ESLint
- Error Lens
- GitLens

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── ui/                # ShadCN components
│   ├── custom/            # Custom components
│   ├── forms/             # Form components
│   ├── seo/               # SEO components
│   └── performance/       # Performance components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configurations
│   ├── env.ts            # Environment validation
│   ├── metadata.ts       # Metadata helpers
│   └── validations/      # Zod schemas
├── services/              # API service layer
├── stores/                # Zustand state stores
└── types/                 # TypeScript definitions
```

## Development Workflow

### 1. Starting Development
```bash
npm run dev
```
The application will be available at [http://localhost:3000](http://localhost:3000).

### 2. Code Quality Checks
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run all validations
npm run validate
```

### 3. Testing
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### 4. Building for Production
```bash
# Build the application
npm run build

# Start production server
npm start
```

## Docker Development

### Using Docker Compose
```bash
# Start development environment
docker-compose -f docker-compose.yml up app

# Rebuild containers
docker-compose build --no-cache

# View logs
docker-compose logs -f app
```

### Using Dockerfile.dev
```bash
# Build development image
docker build -f Dockerfile.dev -t app-dev .

# Run development container
docker run -p 3000:3000 -v $(pwd):/app app-dev
```

## Troubleshooting

### Common Issues

#### TypeScript Errors
```bash
# Clear TypeScript cache
rm -rf .next tsconfig.tsbuildinfo

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### ESLint Issues
```bash
# Fix auto-fixable issues
npm run lint:fix

# Check specific file
npx eslint src/components/ui/button.tsx
```

#### Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Clean build
npm run clean && npm run build
```

#### Docker Issues
```bash
# Rebuild without cache
docker-compose build --no-cache

# Remove all containers and volumes
docker-compose down -v
```

### Environment Variables
- Ensure `.env.local` exists and contains required variables
- Check that environment variables are properly validated in `src/lib/env.ts`
- Restart the development server after changing environment variables

### Performance Issues
- Use the performance dashboard to monitor Core Web Vitals
- Check bundle size with `npm run build`
- Optimize images and implement lazy loading

## Next Steps

After setup, explore:

1. **[TypeScript Rules](../development/typescript-rules.md)** - Understand strict typing requirements
2. **[Implementation Guide](../architecture/implementation-guide.md)** - Learn about project features
3. **[Performance Guide](../architecture/performance.md)** - Optimize your application
4. **[API Reference](../api/)** - Explore available components and hooks

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the [TypeScript Rules](../development/typescript-rules.md)
3. Consult the [Implementation Guide](../architecture/implementation-guide.md)
4. Open an issue in the project repository

---

**Last Updated**: {{ new Date().toLocaleDateString('en-GB') }}
