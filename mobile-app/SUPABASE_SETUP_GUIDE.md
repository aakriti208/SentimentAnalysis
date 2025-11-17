# Supabase Setup Guide for Journal App

This guide will help you set up Supabase for your journal application.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js and npm installed
- Your journal app code

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in the project details:
   - **Name**: Journal App (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click "Create new project"
5. Wait for the project to finish setting up (2-3 minutes)

## Step 2: Get Your API Credentials

1. In your Supabase project dashboard, click on the **Settings** icon (gear icon) in the sidebar
2. Click on **API** in the Settings menu
3. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

## Step 3: Configure Your App

1. Open your mobile app's `.env` file
2. Replace the placeholder values with your actual credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Set Up the Database

1. In your Supabase dashboard, click on **SQL Editor** in the sidebar
2. Click **New query**
3. Open the `supabase-setup.sql` file from your project
4. Copy all the SQL code from that file
5. Paste it into the Supabase SQL Editor
6. Click **Run** to execute all the queries

This will create:
- `profiles` table for user information
- `journal_entries` table for journal entries
- Row Level Security (RLS) policies for data protection
- Indexes for better performance
- Triggers for automatic timestamp updates

## Step 5: Set Up Storage for Avatars

1. In your Supabase dashboard, click on **Storage** in the sidebar
2. Click **Create a new bucket**
3. Configure the bucket:
   - **Name**: `avatars`
   - **Public bucket**: Toggle **ON** (make it public)
   - Click **Create bucket**
4. Click on the `avatars` bucket you just created
5. Click on **Policies** tab
6. The policies are already created by the SQL script, so you should see them listed

## Step 6: Configure Authentication

1. In your Supabase dashboard, click on **Authentication** in the sidebar
2. Click on **Providers**
3. Make sure **Email** is enabled (it should be by default)
4. Optional: Configure other providers like Google, GitHub, etc.
5. Click on **Email Templates** to customize your email verification and password reset emails

### Recommended Email Settings:
- **Confirm your signup**: Customize the welcome message
- **Reset your password**: Customize the reset instructions
- **Email Change**: Keep default or customize

## Step 7: Test Your Setup

1. Make sure your `.env` file has the correct credentials
2. Restart your Expo development server:
   ```bash
   npm start
   ```
3. Try registering a new user
4. Check your Supabase dashboard > **Authentication** > **Users** to see if the user was created
5. Try creating a journal entry
6. Check your Supabase dashboard > **Table Editor** > **journal_entries** to see if the entry was saved

## Troubleshooting

### Common Issues:

1. **"Missing Supabase environment variables" error**
   - Make sure your `.env` file is in the root of your mobile-app folder
   - Restart your Expo server after adding the `.env` file

2. **Authentication errors**
   - Check that email authentication is enabled in Supabase
   - Verify your API keys are correct
   - Check the browser console for detailed error messages

3. **Can't save entries**
   - Make sure you ran the SQL setup script completely
   - Check that RLS policies are enabled
   - Verify the user is authenticated before trying to save

4. **Avatar upload fails**
   - Make sure the `avatars` bucket exists and is public
   - Check that storage policies are created
   - Verify the file size is under 2MB

## Database Schema

### profiles table
- `id` (UUID, Primary Key): User ID from auth.users
- `name` (TEXT): User's display name
- `email` (TEXT): User's email address
- `avatar` (TEXT): URL to avatar image
- `created_at` (TIMESTAMP): When profile was created
- `updated_at` (TIMESTAMP): When profile was last updated

### journal_entries table
- `id` (UUID, Primary Key): Entry ID
- `user_id` (UUID, Foreign Key): References profiles.id
- `title` (TEXT): Entry title
- `content` (TEXT): Entry content
- `date` (TIMESTAMP): Entry date
- `created_at` (TIMESTAMP): When entry was created
- `updated_at` (TIMESTAMP): When entry was last updated

## Security Features

Your app uses Row Level Security (RLS) to ensure:
- Users can only see their own profile
- Users can only see their own journal entries
- Users can only modify their own data
- Users can only upload/delete their own avatars

## Next Steps

- Set up email verification requirements (optional)
- Configure custom email templates
- Set up backup policies
- Monitor usage in the Supabase dashboard
- Consider setting up a staging/development project

## Support

If you encounter issues:
1. Check the Supabase documentation: https://supabase.com/docs
2. Check the browser console for error messages
3. Review the SQL Editor for any failed queries
4. Check the Supabase logs in the dashboard

Happy journaling! 🎉
