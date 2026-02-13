# Postpartum Recovery Risk Analyzer

A React + Vite healthcare application for tracking postpartum recovery with Supabase backend.

## Features

- **Authentication**: Email/password signup and login with Supabase
- **Protected Routes**: Dashboard accessible only to logged-in users
- **Daily Health Tracking**: Log mood, sleep, bleeding level, pain, iron intake, and support level
- **Recovery Score Calculation**: Automatic scoring algorithm (0-100 scale)
- **Risk Classification**: High Risk (0-40), Moderate Risk (41-70), Stable (71-100)
- **Trend Visualization**: Recharts graphs showing recovery and mood scores over last 5 days
- **Smart Navigation**:
  - High Risk → Consult Specialists (doctors, nutritionists, psychologists)
  - Moderate Risk → Find Nutritionist
  - Stable → View Recovery Tips
- **Specialist Directory**: Contact information and scheduling for healthcare providers
- **Recovery Tips**: Personalized advice for stable recovery users

## Tech Stack

- React 19.2
- Vite 8
- Supabase (Auth + PostgreSQL)
- Recharts (data visualization)
- React Router 7

## Setup Instructions

### 1. Environment Variables

Create `.env` file in project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-api-key
```

### 2. Supabase Configuration

#### Create Table: `daily_records`

```sql
create table public.daily_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  mood_score int,
  sleep_hours int,
  bleeding_level int,
  pain_score int,
  iron_intake bool,
  support_level int,
  recovery_score int,
  risk_level text,
  created_at timestamptz default now()
);
```

#### Enable Row Level Security (RLS)

Enable RLS on `daily_records` table.

#### Create Policies

1. **SELECT Policy** (authenticated users):
   ```sql
   SELECT user_id = auth.uid()
   ```

2. **INSERT Policy** (authenticated users):
   ```sql
   INSERT user_id = auth.uid()
   ```

#### Enable Email Authentication

- Go to Auth → Providers → Email
- **Disable "Confirm email"** for immediate access on signup
- Or enable email confirmation if you want verification links

## Running the Project

### Development

```bash
npm install
npm run dev
```

Server runs at `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## File Structure

```
src/
  components/
    Login.jsx           - Email/password auth form
    Dashboard.jsx       - Main dashboard with score and form
    HealthForm.jsx      - Daily health data form
    GraphSection.jsx    - Recharts trend visualization
    Specialists.jsx     - Directory of doctors, nutritionists, psychologists
    Tips.jsx            - Recovery tips for stable users
  supabaseClient.js     - Supabase client configuration
  App.jsx               - Routing and session management
  main.jsx              - React entry point
  App.css               - Global styles
  index.css             - Base styles
```

## Recovery Score Algorithm

Score calculated out of 100 using weighted components:

- **Mood (40%)**: 1-5 scale, directly weighted
- **Sleep (15%)**: Normalized to 10 hours
- **Bleeding Level (15%)**: Reverse scoring (3 = best)
- **Pain Score (20%)**: Reverse scoring (1 = best, 10 = worst)
- **Support Level (10%)**: 1-3 scale
- **Iron Intake (5%)**: Boolean bonus

Risk classification:
- 0-40: **High Risk** (red)
- 41-70: **Moderate Risk** (yellow)
- 71-100: **Stable** (green)

## Key Routes

- `/login` - Login/signup page
- `/dashboard` - Main dashboard (protected)
- `/specialists` - Specialist directory (protected)
- `/tips` - Recovery tips (protected)

## Notes

- All user data is protected by RLS policies
- Users can only see their own records
- Graphs show last 5 records sorted by date
- Specialist directory is demo data; replace with real contacts
- Alerts guide users to appropriate next steps based on risk level

## Future Enhancements

- Doctor/specialist booking integration
- Push notifications for high-risk alerts
- Export records to PDF
- Mobile app with notifications
- Multilingual support
- Integration with wearables (Fitbit, Apple Health)
