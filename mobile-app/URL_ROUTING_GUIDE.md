# URL Routing Guide

I've configured React Navigation linking so the browser URL updates when navigating between screens.

## 🌐 URL Structure

### When Not Logged In (Auth Screens):
- **Login**: `http://localhost:8081/login`
- **Register**: `http://localhost:8081/register`

### When Logged In (App Screens):
- **Home**: `http://localhost:8081/` (root)
- **New Entry**: `http://localhost:8081/new-entry`
- **Profile**: `http://localhost:8081/profile`

## 📱 How It Works

### Automatic URL Updates:
- When you navigate to Login → URL changes to `/login`
- When you navigate to Register → URL changes to `/register`
- When you login successfully → URL changes to `/` (home)
- When you tap avatar → URL changes to `/profile`
- When you tap + button → URL changes to `/new-entry`
- When you logout → URL changes to `/login`

### Manual URL Navigation:
You can also type URLs directly in the browser:
- Type `http://localhost:8081/register` → Opens Register screen
- Type `http://localhost:8081/profile` → Opens Profile (if logged in)
- Type `http://localhost:8081/` → Opens Home (if logged in) or Login (if not)

## 🔄 Navigation Flow

```
User opens app
    ↓
Not authenticated → URL: /login
    ↓
Taps "Sign Up" → URL: /register
    ↓
Registers successfully → URL: / (home)
    ↓
Taps avatar → URL: /profile
    ↓
Taps back → URL: /
    ↓
Taps + button → URL: /new-entry
    ↓
Saves entry → URL: /
    ↓
Logs out → URL: /login
```

## 🔒 Protected Routes

The app automatically handles route protection:
- If not logged in and you try to access `/profile` → Redirected to `/login`
- If logged in and you try to access `/login` → Redirected to `/` (home)

## 🎯 Benefits

1. **Bookmarkable URLs**: Users can bookmark specific pages
2. **Browser Back/Forward**: Browser navigation buttons work
3. **Shareable Links**: Can share links to specific screens
4. **Better UX**: URL reflects current location in app
5. **Web Standards**: Behaves like a normal web app

## 📝 Configuration Details

The linking configuration in `App.js`:

```javascript
const linking = {
  prefixes: ['http://localhost:8081', 'exp://'],
  config: {
    screens: {
      // Auth screens
      Login: 'login',
      Register: 'register',

      // App screens
      Home: '',           // Root path
      NewEntry: 'new-entry',
      Profile: 'profile',
    },
  },
};
```

## 🧪 Testing

1. **Test Navigation**:
   - Click through the app normally
   - Watch the browser URL bar update

2. **Test Direct URLs**:
   - Type `http://localhost:8081/register` in browser
   - Should open Register screen directly

3. **Test Browser Back/Forward**:
   - Navigate through app
   - Use browser back button
   - Should go to previous screen

4. **Test Logout Redirect**:
   - Login and navigate around
   - Logout
   - Should redirect to `/login`

## 🚀 Production URLs

When you deploy, update the prefixes in `App.js`:

```javascript
const linking = {
  prefixes: [
    'https://your-domain.com',
    'exp://',
    'myapp://'
  ],
  // ... rest of config
};
```

## 💡 Adding New Screens

To add new screens with URL routing:

1. Add to linking config:
```javascript
config: {
  screens: {
    // Existing screens...
    NewScreen: 'new-screen',  // URL: /new-screen
  },
}
```

2. Add to Stack Navigator:
```javascript
<Stack.Screen
  name="NewScreen"
  component={NewScreenComponent}
  options={{ title: 'New Screen' }}
/>
```

Now the URL will be `http://localhost:8081/new-screen`!
