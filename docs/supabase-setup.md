# Supabase Setup for QuadFund

This document outlines the steps needed to set up Supabase for the QuadFund application.

## 1. Create a Supabase Account

1. Go to [Supabase](https://supabase.com/) and sign up for an account
2. Create a new project
3. Note down your project URL and anon key (public)

## 2. Set Up Environment Variables

1. Create a `.env.local` file in the root of your project
2. Add the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 3. Create the Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Copy the contents of `supabase-setup.sql` from this project
3. Run the SQL to set up your tables and policies

## 4. Test the Integration

1. Start your Next.js development server
2. Submit a project through the UI
3. Verify in the Supabase Table Editor that the project was created
4. Check the "My Submissions" tab to see if your project appears

## 5. Row Level Security (RLS)

The SQL setup script includes a basic RLS policy that allows anyone to view approved projects. In a production environment, you'll want to extend these policies to:

1. Only allow users to view their own unapproved projects
2. Only allow admins to approve projects
3. Only allow project owners to update their own projects

## 6. Troubleshooting

If you encounter any issues:

1. Check the browser console for error messages
2. Check your server logs for API error messages
3. Verify your environment variables are set correctly
4. Ensure your Supabase project is active and the tables exist

The application includes fallbacks to in-memory storage if Supabase connections fail. 