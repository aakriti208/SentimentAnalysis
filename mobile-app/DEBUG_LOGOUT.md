# Debug Logout Issue

I've added detailed console logging to help debug the logout issue. Here's how to test:

## Step-by-Step Debugging:

### 1. Open Your Developer Console
- **Metro Bundler**: Check the terminal where `npm start` is running
- **React Native Debugger**: Open Chrome DevTools (press `j` in terminal)
- **Expo Go**: Shake device and tap "Debug Remote JS"

### 2. Test Logout
1. Login to your app
2. Navigate to Profile (tap avatar in top-right)
3. Tap the "Logout" button
4. Tap "Logout" in the confirmation dialog

### 3. Check Console Output

You should see these logs in order:

```
🔴 Logout button pressed - starting logout process
🔴 Calling authService.logout()...
🔵 authService.logout() - Calling supabase.auth.signOut()
🔵 Supabase signOut successful - session cleared
✅ Supabase logout successful
✅ Redux state cleared
```

## What Each Log Means:

### 🔴 Logs (ProfileScreen.js)
- **"Logout button pressed"** - Button was clicked and dialog confirmed
- **"Calling authService.logout()"** - About to call Supabase logout

### 🔵 Logs (authService.js)
- **"Calling supabase.auth.signOut()"** - Making API call to Supabase
- **"Supabase signOut successful"** - API call succeeded

### ✅ Logs (ProfileScreen.js)
- **"Supabase logout successful"** - Auth service completed
- **"Redux state cleared"** - Redux state reset

### ❌ Logs (Errors)
- **"Logout error"** - Something went wrong
- **"Supabase signOut error"** - API call failed

## Troubleshooting:

### If you DON'T see ANY logs:
❌ **Button isn't being pressed**
- Check if button is actually tappable
- Make sure you're confirming the dialog
- Try reloading the app

### If you see 🔴 but NO 🔵 logs:
❌ **authService.logout() not being called**
- Check imports in ProfileScreen.js
- Verify authService is imported correctly
- Check network connectivity

### If you see 🔵 but it fails:
❌ **Supabase API call failing**
- Check `.env` file has correct credentials
- Verify Supabase project is active
- Check internet connection
- Look at the error message

### If everything logs successfully but you're not redirected:
❌ **Navigation issue**
- Check Redux state in Redux DevTools
- Verify `isAuthenticated` becomes `false`
- Check App.js navigation logic

## Quick Test:

Run this in your browser console (if using Chrome debugger):

```javascript
// Check if Supabase is initialized
console.log('Supabase client:', window.supabase);

// Check current session
window.supabase?.auth.getSession().then(({ data }) => {
  console.log('Current session:', data);
});
```

## Expected Behavior:

### Before Logout:
- Session exists in AsyncStorage
- User is authenticated
- Can access Home screen

### After Logout:
- Session removed from AsyncStorage
- User is NOT authenticated
- Redirected to Login screen
- Cannot access Home screen

## Network Tab Check:

If using Chrome DevTools:
1. Open **Network** tab
2. Tap logout
3. Look for request to Supabase:
   - URL: `https://[your-project].supabase.co/auth/v1/logout`
   - Method: `POST`
   - Status: `204 No Content` (success)

If you DON'T see this request, the API call isn't being made!

## Common Fixes:

### Fix 1: Restart Metro Bundler
```bash
# Kill the process
# Then restart:
npm start
```

### Fix 2: Clear Cache
```bash
npm start -- --reset-cache
```

### Fix 3: Check AsyncStorage
```javascript
// In console
import AsyncStorage from '@react-native-async-storage/async-storage';
AsyncStorage.getAllKeys().then(keys => console.log('Storage keys:', keys));
```

## What to Report:

Please share:
1. Which logs you see (🔴, 🔵, ✅, ❌)
2. Any error messages
3. Whether button tap works
4. Whether dialog appears
5. Network requests in Network tab
