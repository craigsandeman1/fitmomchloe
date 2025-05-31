# Fit Mom Chloe - Project Planning & Architecture

## 🎯 Project Overview
Fit Mom Chloe is a fitness and nutrition platform for mothers, featuring meal plans, workout plans, and personal training services. The application uses React with TypeScript, Supabase for backend services, PayFast for payments, and is deployed on Vercel.

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom primary color `#E6827C`
- **State Management**: Zustand for global state
- **Routing**: React Router with protected routes
- **Icons**: Lucide React
- **PDF Generation**: jsPDF for meal/workout plan PDFs

### Backend & Services
- **Database**: Supabase (PostgreSQL with RLS)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage for images and files
- **Email**: Supabase Edge Functions with React email templates
- **Payments**: PayFast integration (South African payment gateway)

### Deployment & Infrastructure
- **Hosting**: Vercel
- **Environment**: Development (localhost:3001), Production (Vercel)
- **Payment Mode**: Sandbox for testing, Live for production

## 📁 Project Structure
```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── admin/              # Admin dashboard components
│   ├── Auth.tsx            # Authentication component
│   ├── PayfastButton.tsx   # Payment integration
│   └── RecipeModal.tsx     # Meal plan recipe display
├── pages/
│   ├── Home.tsx           # Landing page
│   ├── MealPlans.tsx      # Meal plans marketplace
│   ├── WorkoutPlans.tsx   # Workout plans marketplace
│   ├── AdminDashboard.tsx # Admin interface
│   ├── PaymentResult.tsx  # Payment success/cancel pages
│   └── Booking.tsx        # Personal training booking
├── lib/
│   ├── supabase.ts        # Database client and utilities
│   ├── emailService.ts    # Email sending functionality
│   ├── env.ts             # Environment configuration
│   └── meal-plan-generator.ts # PDF generation utilities
├── store/
│   ├── auth.ts            # Authentication state
│   ├── mealPlan.ts        # Meal plans state
│   └── workoutPlan.ts     # Workout plans state
├── types/
│   ├── meal-plan.ts       # Meal plan TypeScript types
│   └── workout-plan.ts    # Workout plan TypeScript types
├── email-templates/
│   ├── user/              # Customer email templates
│   └── admin/             # Admin notification templates
└── styles/
    └── index.css          # Global styles and Tailwind config
```

## 🎨 Design System & UI Guidelines

### Color Palette
- **Primary**: `#E6827C` (Coral/Pink theme)
- **Secondary**: Greens for success states
- **Background**: Light grays and whites
- **Text**: Dark grays for readability

### Typography
- **Headers**: Playfair Display (font-playfair)
- **Body**: System fonts (Arial, sans-serif)
- **Sizing**: Responsive text scaling with Tailwind utilities

### Component Patterns
- **Cards**: White background with rounded corners and subtle shadows
- **Buttons**: Gradient backgrounds with hover effects and transitions
- **Forms**: Clean inputs with proper validation states
- **Modals**: Centered overlays with backdrop blur

## 🔐 Authentication & Security

### User Authentication Flow
1. Email/password signup and login via Supabase Auth
2. Email confirmation required for new accounts
3. Protected routes redirect to login when not authenticated
4. Persistent sessions with automatic refresh

### Payment Security
- PayFast integration with proper signature verification
- Sandbox mode for testing, live mode for production
- Purchase validation and duplicate prevention
- Secure webhook handling for payment notifications

### Database Security
- Row Level Security (RLS) policies on all tables
- User-specific data access controls
- Admin-only access for management functions
- Proper data validation and sanitization

## 💳 Payment Integration Details

### PayFast Configuration
```typescript
// Sandbox credentials for testing
VITE_PAYFAST_MERCHANT_ID=10000100
VITE_PAYFAST_MERCHANT_KEY=46f0cd694581a
VITE_PAYFAST_PASSPHRASE=jt7NOE43FZPn
VITE_PAYFAST_SANDBOX=true
```

### Payment Flow
1. User selects meal/workout plan
2. Authentication required before payment
3. PayFast form generation with signature
4. Redirect to PayFast payment page
5. Webhook receives payment notification
6. Database purchase record created
7. Confirmation emails sent
8. User redirected to success page
9. Immediate download access provided

## 📧 Email System

### Email Templates
- **Purchase Confirmation**: Sent to customer with download link
- **Admin Notification**: Sent to admin when purchase made
- **Welcome Email**: Sent to new user registrations
- **Booking Confirmation**: Sent for personal training bookings

### Email Service
- Supabase Edge Functions handle email sending
- React-based email templates for consistent styling
- Error handling and retry logic
- Test mode for development

## 🗄️ Database Schema

### Core Tables
- `meal_plans`: Meal plan products with pricing and content
- `workout_plans`: Workout plan products with exercises
- `purchases`: Purchase records linking users to products
- `bookings`: Personal training session bookings
- `users`: Extended user profiles (linked to Supabase Auth)

### Key Relationships
- Users can have multiple purchases
- Purchases link to specific meal/workout plans
- RLS ensures users only see their own data
- Admin users have special access permissions

## 🧪 Testing Strategy

### Current Testing Gaps
- No automated tests currently implemented
- Manual testing for payment flows
- Email delivery testing in development
- Cross-browser compatibility unknown

### Testing Priorities
1. **Payment Flow Testing**: End-to-end purchase validation
2. **Email Delivery Testing**: Confirmation and notification emails
3. **Authentication Testing**: Login/signup and protected routes
4. **Database Testing**: Data integrity and RLS policies
5. **UI/UX Testing**: Responsive design and accessibility

## 🚀 Development Workflow

### Environment Setup
1. Clone repository and install dependencies
2. Configure environment variables in `.env.local`
3. Start development server with `npm run dev`
4. Access admin dashboard for content management
5. Test payment flows in sandbox mode

### Code Quality Standards
- TypeScript for type safety
- ESLint and Prettier for code formatting
- Component-based architecture
- Proper error handling and loading states
- Responsive design with mobile-first approach

### Deployment Process
1. Build application with `npm run build`
2. Deploy to Vercel with environment variables
3. Test production functionality
4. Monitor for errors and performance

## 📈 Performance Considerations

### Optimization Strategies
- Code splitting with React.lazy()
- Image optimization and lazy loading
- Efficient state management with Zustand
- Database query optimization
- CDN usage for static assets

### Monitoring & Analytics
- Error tracking and logging
- Performance monitoring
- User behavior analytics
- Payment success/failure rates

## 🔧 Configuration Management

### Environment Variables
```bash
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# PayFast
VITE_PAYFAST_MERCHANT_ID=merchant_id
VITE_PAYFAST_MERCHANT_KEY=merchant_key
VITE_PAYFAST_PASSPHRASE=passphrase
VITE_PAYFAST_SANDBOX=true_or_false

# Email
RESEND_API_KEY=your_resend_key
VITE_ADMIN_EMAILS=admin@example.com
```

### Build Configuration
- Vite configuration for development and production
- TypeScript configuration for strict type checking
- Tailwind configuration with custom theme
- ESLint configuration for code quality

This planning document serves as the foundation for understanding the Fit Mom Chloe project architecture, development standards, and testing requirements. 