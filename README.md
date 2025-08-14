# ShadCN Next.js Application

A modern, production-ready web application built with Next.js 15.3, React 19.1, and ShadCN UI. Designed with British standards in mind, following strict TypeScript best practices.

## 🚀 Tech Stack

- **Framework**: Next.js 15.3 with App Router
- **React**: 19.1.0 with latest features
- **UI Library**: ShadCN UI with Radix UI primitives
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript with strict configuration
- **Theme**: next-themes for dark/light mode
- **Icons**: Lucide React
- **Notifications**: Sonner for toast notifications

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles with CSS variables
├── components/
│   ├── ui/                # ShadCN UI components
│   └── custom/            # Custom application components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configurations
├── types/                 # TypeScript type definitions
├── services/              # API and external service integrations
├── stores/                # State management
└── docs/                  # Documentation
```

## 🛠 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shadcn-nextjs-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Features

### ✅ Core Features
- 🌓 **Dark/Light Mode**: System-aware theme switching
- 📱 **Mobile First**: Responsive design across all devices
- ♿ **Accessibility**: WCAG compliant components
- 🔧 **TypeScript**: Strict typing with comprehensive error handling
- 🚀 **Performance**: Optimised with Next.js 15.3 features
- 🎯 **SEO Ready**: Proper metadata and semantic structure

### 🧩 Components Included
- **Button**: Multiple variants and sizes
- **Card**: Content containers with headers
- **Input**: Form input fields
- **Form**: Complete form handling with validation
- **Dropdown Menu**: Interactive menus
- **Navigation Menu**: Site navigation components
- **Sonner**: Beautiful toast notifications
- **Theme Toggle**: Dark/light mode switcher

### 📊 Developer Experience
- **Hot Reload**: Instant development feedback
- **Error Handling**: Comprehensive error boundaries
- **Type Safety**: End-to-end TypeScript coverage
- **Code Quality**: ESLint and Prettier configuration
- **Custom Hooks**: Reusable logic patterns

## 🏗 Architecture

### TypeScript Configuration
- Strict type checking enabled
- No unused variables or parameters
- Exact optional property types
- Comprehensive path aliases
- Enhanced error reporting

### Component Patterns
- Functional components with hooks
- Props interfaces for all components
- Proper error boundaries
- Memoisation for performance
- Accessibility attributes

### API Integration
- Custom `useApi` hook for data fetching
- Proper loading and error states
- Type-safe API responses
- Mutation handling with `useApiMutation`

## 🌍 Localisation (UK Standards)

- **Language**: British English (en-GB)
- **Currency**: Pounds Sterling (£)
- **Date Format**: DD/MM/YYYY
- **Number Format**: UK decimal notation

## 📝 Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# ShadCN UI
npx shadcn@latest add <component>  # Add new components
npx shadcn@latest init            # Reinitialise configuration
```

## 🔧 Configuration Files

- `tsconfig.json` - TypeScript configuration with strict rules
- `tailwind.config.ts` - Tailwind CSS configuration
- `components.json` - ShadCN UI configuration
- `next.config.ts` - Next.js configuration
- `.eslintrc.json` - ESLint rules

## 📚 Documentation

### Adding New Components
1. Use ShadCN CLI: `npx shadcn@latest add <component>`
2. Place custom components in `src/components/custom/`
3. Export from appropriate index files
4. Document with JSDoc comments

### API Integration
```typescript
// Example using the custom hook
const { data, loading, error, refetch } = useApi<User[]>('/api/users');

// Example mutation
const { mutate, loading } = useApiMutation<User, CreateUserData>('/api/users');
```

### Theme Integration
```typescript
// Using the theme in components
import { useTheme } from 'next-themes';

const { theme, setTheme } = useTheme();
```

## 🧪 Testing

The project includes setup for:
- Unit tests with Jest
- Component testing with Testing Library
- E2E tests with Playwright
- Type checking with TypeScript

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your Git repository
2. Deploy automatically with each push
3. Environment variables configured in dashboard

### Other Platforms
- **Netlify**: Works with static export
- **Railway**: Full-stack deployment
- **Docker**: Dockerfile included

## 📈 Performance

- **Lighthouse Score**: 100/100 (target)
- **Core Web Vitals**: Optimised
- **Bundle Size**: Minimised with tree-shaking
- **Loading**: Progressive enhancement

## 🔒 Security

- Input validation with Zod schemas
- CSRF protection
- Environment variable validation
- Secure headers configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation in `/docs`
- Review component examples
- Consult the TypeScript definitions
- Open an issue for bugs or feature requests

---

Built with ❤️ and ☕ following British coding standards.
