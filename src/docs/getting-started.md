# Getting Started Guide

This guide will help you get up and running with the ShadCN Next.js application.

## Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm
- Git for version control
- A code editor (VS Code recommended)

## Quick Start

### 1. Project Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### 2. Project Structure Overview

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── ui/                # ShadCN components
│   └── custom/            # Your custom components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configurations
├── types/                 # TypeScript definitions
├── services/              # API integrations
└── stores/                # State management
```

### 3. Adding Your First Component

1. **Add a ShadCN component:**
   ```bash
   npx shadcn@latest add alert
   ```

2. **Create a custom component:**
   ```typescript
   // src/components/custom/welcome-banner.tsx
   import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
   
   export function WelcomeBanner() {
     return (
       <Alert>
         <AlertTitle>Welcome!</AlertTitle>
         <AlertDescription>
           You've successfully set up your ShadCN Next.js application.
         </AlertDescription>
       </Alert>
     );
   }
   ```

3. **Use it in your page:**
   ```typescript
   // src/app/page.tsx
   import { WelcomeBanner } from "@/components/custom/welcome-banner";
   
   export default function HomePage() {
     return (
       <div>
         <WelcomeBanner />
         {/* Rest of your page */}
       </div>
     );
   }
   ```

## Key Features

### Theme Support
The application includes built-in dark/light mode support:

```typescript
import { ThemeToggle } from "@/components/custom/theme-toggle";

// Use anywhere in your app
<ThemeToggle />
```

### Type Safety
All components are fully typed:

```typescript
interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export function UserCard({ user }: UserCardProps) {
  // Component implementation
}
```

### API Integration
Use the custom hooks for API calls:

```typescript
import { useApi } from "@/hooks/use-api";

function UserList() {
  const { data: users, loading, error } = useApi<User[]>('/api/users');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {users?.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

## Development Tips

### 1. VS Code Extensions
Recommended extensions:
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Prettier - Code formatter
- ESLint

### 2. Component Development
- Always define prop interfaces
- Use JSDoc comments for documentation
- Follow the single responsibility principle
- Include error boundaries where needed

### 3. Styling Guidelines
- Use Tailwind CSS classes
- Leverage CSS variables for theming
- Follow mobile-first responsive design
- Maintain consistency with ShadCN design tokens

## Next Steps

1. **Explore Components**: Check out the available ShadCN components
2. **Add Forms**: Use React Hook Form with Zod validation
3. **API Routes**: Create Next.js API routes for backend functionality
4. **Deployment**: Deploy to Vercel or your preferred platform

## Common Issues

### TypeScript Errors
- Ensure all props have proper type definitions
- Use strict type checking settings
- Import types correctly from `@/types`

### Styling Issues
- Check if Tailwind classes are applied correctly
- Verify theme provider is wrapping your app
- Ensure CSS variables are defined

### Performance
- Use React.memo for expensive components
- Implement proper loading states
- Optimise images with next/image

## Support

If you encounter issues:
1. Check the TypeScript definitions in `src/types/`
2. Review component examples in the codebase
3. Consult the official ShadCN documentation
4. Open an issue in the project repository

Happy coding! 🚀 