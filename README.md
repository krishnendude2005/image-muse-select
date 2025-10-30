# Image Search & Multi-Select Application

A full-stack web application for searching and selecting images with OAuth authentication.

## Features

- **OAuth Authentication**: Secure login via Google and GitHub
- **Image Search**: Search for images using keywords
- **Multi-Select**: Select multiple images with a floating counter
- **Top Searches**: View the top 5 most popular search terms across all users
- **Search History**: Personal search history with timestamps
- **Responsive Design**: Modern, clean interface with responsive grid layout

## Tech Stack

### Frontend
- React + Vite
- TanStack Query for data fetching
- Tailwind CSS for styling
- shadcn/ui component library

### Backend
- PostgreSQL database
- RESTful API architecture
- OAuth 2.0 authentication
- Row-Level Security (RLS) for data protection

## Project Structure

```
project-root/
├── src/
│   ├── pages/              # Page components
│   │   ├── Index.tsx       # Main dashboard
│   │   └── Auth.tsx        # Authentication page
│   ├── components/         # Reusable UI components
│   │   ├── TopSearchesBanner.tsx
│   │   ├── SearchHistory.tsx
│   │   └── ImageGrid.tsx
│   └── integrations/       # Backend integration
├── supabase/
│   └── migrations/         # Database migrations
├── public/                 # Static assets
└── package.json            # Dependencies
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/krishnendude2005/image-muse-select.git
cd image-muse-select
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following:
```
VITE_SUPABASE_URL=your_database_url
VITE_SUPABASE_ANON_KEY=your_database_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## API Endpoints

### Authentication
- OAuth providers: Google, GitHub
- Protected routes require authentication

### Search Operations

#### Store Search Term
```javascript
// POST /api/search
await supabase
  .from('search_history')
  .insert({
    user_id: user.id,
    search_term: searchTerm
  });
```

#### Get Top Searches
```javascript
// GET /api/top-searches
await supabase
  .rpc('get_top_searches', { limit_count: 5 });

// Response:
[
  { search_term: "nature", search_count: 15 },
  { search_term: "technology", search_count: 12 },
  ...
]
```

#### Get User Search History
```javascript
// GET /api/history
await supabase
  .from('search_history')
  .select('*')
  .order('timestamp', { ascending: false });

// Response:
[
  {
    id: "uuid",
    user_id: "uuid",
    search_term: "nature",
    timestamp: "2025-10-30T15:30:00Z"
  },
  ...
]
```

## Database Schema

### search_history Table
```sql
CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  search_term TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_timestamp ON search_history(timestamp DESC);
```

### Security
- Row-Level Security (RLS) enabled
- Users can only view and insert their own search history
- Top searches function aggregates across all users

## Configuration

### OAuth Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI
4. Configure in authentication settings

#### GitHub OAuth
1. Go to GitHub Settings → Developer Settings → OAuth Apps
2. Create new OAuth App
3. Set authorization callback URL
4. Configure in authentication settings

### Image Search API (Optional)
To enable real image search (currently using mock data):
1. Get API key from [Unsplash](https://unsplash.com/developers)
2. Update image search implementation in `src/pages/Index.tsx`

## Usage

### Authentication
1. Navigate to `/auth` page
2. Click "Continue with Google" or "Continue with GitHub"
3. Complete OAuth flow
4. Redirect to main dashboard

### Searching Images
1. After login, enter search term
2. Click Search button
3. View 12 results in 4-column grid
4. Search term automatically saved to history

### Multi-Select
1. Click checkbox on any image
2. Floating counter shows selection count
3. Click again to deselect

### Viewing Statistics
- **Top Searches Banner**: Displays top 5 searches with counts
- **Search History Sidebar**: Shows your personal search history with timestamps

## Development

### Available Scripts
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Structure Guidelines
- Components are organized by feature
- All API calls use TanStack Query for caching
- TypeScript for type safety
- Tailwind CSS for styling consistency

## Deployment

### Production Build
```bash
npm run build
```

The build output will be in the `dist/` directory.

### Environment Variables
Ensure production environment has:
- Database credentials
- OAuth provider credentials configured
- Proper CORS settings

## Security Features

- OAuth 2.0 authentication
- Row-Level Security on database
- Secure session management
- Protected API endpoints
- XSS and CSRF protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for learning and development.

## Support

For issues and questions, please open an issue in the GitHub repository.
