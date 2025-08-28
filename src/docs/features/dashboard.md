# Dashboard Feature

## Overview

The dashboard is a protected route that requires user authentication. It provides a comprehensive interface with analytics, data tables, and navigation components.

## Features

### Authentication Protection
- **ProtectedRoute Component**: Wraps the dashboard to ensure only authenticated users can access it
- **Automatic Redirects**: Unauthenticated users are redirected to the login page
- **Loading States**: Shows loading spinner while checking authentication status

### Dashboard Components
- **AppSidebar**: Navigation sidebar with user profile and logout functionality
- **SiteHeader**: Top header with search and notifications
- **SectionCards**: Overview cards showing key metrics
- **ChartAreaInteractive**: Interactive charts for data visualization
- **DataTable**: Tabular data display with sorting and filtering

### User Management
- **User Profile**: Displays authenticated user information in the sidebar
- **Logout Functionality**: Allows users to log out from the dashboard
- **Avatar Fallback**: Shows user initials when avatar is not available

## Implementation Details

### Protected Route Wrapper
```typescript
<ProtectedRoute>
  <DashboardContent />
</ProtectedRoute>
```

### Authentication Flow
1. User logs in with valid credentials
2. Authentication state is updated in Zustand store
3. User is automatically redirected to `/dashboard`
4. Dashboard checks authentication status on mount
5. If not authenticated, user is redirected to login page

### Demo Credentials
- **Email**: `demo@example.com`
- **Password**: `demo123`

## File Structure

```
src/
├── app/
│   └── dashboard/
│       ├── page.tsx          # Main dashboard page
│       └── data.json         # Sample data for charts/tables
├── components/
│   ├── auth/
│   │   └── protected-route.tsx  # Authentication wrapper
│   ├── app-sidebar.tsx       # Navigation sidebar
│   ├── site-header.tsx       # Top header
│   ├── section-cards.tsx     # Overview cards
│   ├── chart-area-interactive.tsx  # Interactive charts
│   ├── data-table.tsx        # Data table component
│   └── nav-user.tsx          # User profile component
└── stores/
    └── auth.store.ts         # Authentication state management
```

## Usage

### Accessing the Dashboard
1. Navigate to `/login`
2. Enter demo credentials: `demo@example.com` / `demo123`
3. Upon successful login, you'll be redirected to `/dashboard`

### Navigation
- **Dashboard**: Main dashboard view (current page)
- **Lifecycle**: Project lifecycle management
- **Analytics**: Data analytics and reporting
- **Projects**: Project management
- **Team**: Team member management

### User Actions
- **Profile**: Access user account settings
- **Billing**: Manage billing information
- **Notifications**: Configure notification preferences
- **Logout**: Sign out of the application

## Security Features

- **Route Protection**: All dashboard routes require authentication
- **Session Management**: Automatic session validation
- **Secure Redirects**: Proper redirect handling for unauthenticated users
- **Token Management**: JWT token storage and validation

## Future Enhancements

- [ ] Real-time data updates
- [ ] Customizable dashboard layouts
- [ ] Advanced filtering and search
- [ ] Export functionality for reports
- [ ] Mobile-responsive optimizations
- [ ] Dark mode support
- [ ] Accessibility improvements
