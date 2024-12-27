# KarteiKarten - Salon Management System

## Project Overview

KarteiKarten is a comprehensive salon management system built with Next.js and React. It provides a user-friendly interface for salon owners and staff to manage clients, appointments, venues, and stylists. The application uses modern web technologies and follows best practices in React development.

## File Structure

The project is organized into the following main directories:

- `app/`: Contains the main application pages and routing structure.
- `components/`: Houses reusable React components used throughout the application.
- `lib/`: Stores utility functions and shared logic.

Key files and their purposes:

- `app/layout.tsx`: The root layout component that wraps all pages.
- `app/page.tsx`: The main dashboard page.
- `app/clients/page.tsx`: The clients list page.
- `app/clients/add/page.tsx`: The add new client page.
- `app/clients/[id]/page.tsx`: The individual client details page.
- `app/clients/[id]/appointments/[appointmentId]/page.tsx`: The individual appointment details page.
- `app/settings/page.tsx`: The settings page with company, venue, and stylist management.
- `app/venues/page.tsx`: The venues management page.
- `app/stylists/page.tsx`: The stylists management page.

## Main Components

1. `MainNav`: The main navigation component used across all pages.
2. `DashboardShell`: A wrapper component for consistent layout across dashboard pages.
3. `DashboardHeader`: A reusable header component for dashboard pages.
4. `ClientList`: Displays a list of clients with search functionality.
5. `AddClientForm`: A form component for adding new clients.
6. `ClientDetails`: Displays detailed information about a specific client.
7. `AppointmentCard`: A form component for creating new appointments.
8. `AppointmentDetails`: Displays detailed information about a specific appointment.
9. `VenuesList`: Displays a list of venues.
10. `AddVenueForm`: A form component for adding new venues.
11. `StylistsList`: Displays a list of stylists.
12. `AddStylistForm`: A form component for adding new stylists.

## Functionality

### Client Management

- View a list of all clients with search functionality
- Add new clients with detailed information
- View individual client details
- Create new appointments for clients
- View client appointment history

### Appointment Management

- Create new appointments with detailed information
- View appointment details including services, products used, and notes
- Upload before and after pictures for appointments

### Venue Management

- View a list of all venues
- Add new venues with detailed information

### Stylist Management

- View a list of all stylists
- Add new stylists with detailed information

### Settings

- Manage company information
- Manage venues
- Manage stylists

## How to Use

1. **Dashboard**: The main page displays an overview of recent clients and quick actions.

2. **Clients**:
   - View all clients on the clients page
   - Use the search functionality to find specific clients
   - Click on a client to view their details
   - Add new clients using the "Add Client" form

3. **Appointments**:
   - Create new appointments from the client details page
   - Fill in all relevant information for the appointment
   - Upload before and after pictures if available

4. **Venues**:
   - View all venues on the venues page
   - Add new venues using the "Add Venue" form

5. **Stylists**:
   - View all stylists on the stylists page
   - Add new stylists using the "Add Stylist" form

6. **Settings**:
   - Update company information
   - Manage venues and stylists from the settings page

## Technical Details

- Built with Next.js 13 using the App Router
- Uses React Server Components for improved performance
- Implements client-side interactivity where necessary (forms, search functionality)
- Utilizes shadcn/ui components for consistent and accessible UI elements
- Form validation using react-hook-form and zod
- Responsive design for mobile and desktop views

## Conclusion

KarteiKarten provides a robust solution for salon management, offering intuitive interfaces for managing clients, appointments, venues, and stylists. Its modular structure and use of modern React practices make it easy to maintain and extend.