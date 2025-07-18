# standy-pumpkins

Volunteer Management Application

## Overview

**standy-pumpkins** is a web application for managing volunteer events, registrations, notifications, and administration for organizations. It features:
- Event scheduling and management
- Volunteer registration and sign-up forms
- Real-time notifications (SMS/email) using Twilio
- Admin dashboard for event, user, signup, and notification management
- Integration with Supabase for backend data and authentication

## Features

- **Volunteer Registration**: Users can register for events, specifying their group size and contact details.
- **Event Capacity Checks**: Ensures registrations do not exceed event capacity.
- **Admin Dashboard**: Access to manage users, events, signups, reminders, and upcoming shifts.
- **Notifications**: Automated and scheduled notifications to volunteers using Twilio.
- **Authentication**: Secure login, error handling for user sign-in/sign-up.
- **Real-time Updates**: Leveraging Supabase subscriptions for live data.

## Technologies Used

- React & TypeScript
- Supabase (database, authentication, real-time updates)
- Twilio (SMS notifications)
- Tailwind CSS (styling)
- Vite (build tooling)

## Project Structure

```
src/
  components/
    admin/                # Admin dashboard and features
    calendar/             # Volunteer calendar views
    notifications/        # Notification tables and modals
    ui/                   # Shared UI components
    volunteer/            # Volunteer registration and confirmation
  hooks/                  # Custom React hooks (auth, forms, notifications)
  lib/
    supabase/             # Supabase client config
    notifications/        # Twilio service and notification logic
    auth/                 # Authentication error messages and logic
  types/                  # Type definitions for events, volunteers, notifications
  utils/                  # Utility functions (date, volunteer, capacity checks)
index.html                # Entry point HTML
tailwind.config.js        # Tailwind CSS configuration
eslint.config.js          # Linting config
```

## Getting Started

1. **Clone the repo**
    ```sh
    git clone https://github.com/SKopetz/standy-pumpkins.git
    cd standy-pumpkins
    ```

2. **Install dependencies**
    ```sh
    npm install
    ```

3. **Configure environment variables**
    - Create a `.env` file using `.env.example` as a template.
    - Set Supabase and Twilio keys.

4. **Start the development server**
    ```sh
    npm run dev
    ```

5. **Access the app**
    - Open [http://localhost:5173](http://localhost:5173) in your browser.

## Documentation

### Volunteer Registration

- Found in `src/hooks/useVolunteerRegistration.ts`
- Handles new and returning volunteer sign-ups, updating event participation, and triggers notifications.

### Event Capacity

- Core logic in `src/utils/volunteerUtils.ts` and `src/hooks/useSignupManagement.ts`
- Ensures group sign-ups do not exceed available event spots.

### Notifications

- Twilio service: `src/lib/notifications/twilioService.ts`
- Notification types and templates: `src/lib/notifications/types.ts`, `src/lib/notifications/messageTemplates.ts`
- Real-time updates via Supabase subscriptions in `src/hooks/useNotifications.ts`

### Admin Features

- Admin dashboard: `src/components/admin/AdminDashboard.tsx`
- Manage events, users, signups, and scheduled notifications.

### Authentication

- Errors and handling: `src/lib/auth/errors.ts`
- Sign-in form: `src/hooks/useSignInForm.ts`

## Contributing

Contributions are welcome! Please open issues or pull requests with improvements or suggestions.

## License

MIT License

---

*For more details, see documentation within each module and comments in the codebase.*
