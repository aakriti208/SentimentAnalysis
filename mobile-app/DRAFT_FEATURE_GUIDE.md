# Draft Feature Guide

The app now supports saving journal entries as drafts!

## 🎯 How It Works

### When Writing a New Entry:

#### Option 1: Save as Published Entry (✓ Checkmark)
- Write your journal entry
- Tap the **✓ checkmark** button (top right)
- Entry is saved as **published**
- Shows up in your main journal list
- Counts toward your entry count and streak

#### Option 2: Save as Draft (✗ Close button)
- Write some content
- Tap the **✗ close** button (top left)
- Dialog appears: **"Save as Draft?"**
- Choose one of:
  - **Discard** - Deletes the content (destructive)
  - **Cancel** - Keeps writing
  - **Save Draft** - Saves as draft

#### Option 3: Discard Empty Entry
- If you haven't written anything
- Tap the **✗ close** button
- Entry is discarded immediately (no dialog)

## 📊 Draft vs Published Entries

### Published Entries (isDraft: false):
✅ Show in main journal list
✅ Count toward entry statistics
✅ Count toward streak
✅ Marked on calendar
✅ Include in journal count

### Draft Entries (isDraft: true):
📝 Saved in database
📝 Can be edited later
❌ Don't show in main list (yet)
❌ Don't count toward statistics
❌ Don't affect streak
❌ Not marked on calendar

## 🗄️ Database Schema

Added `is_draft` column to `journal_entries` table:

```sql
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY,
    user_id UUID,
    title TEXT,
    content TEXT,
    is_draft BOOLEAN DEFAULT FALSE,  -- New field!
    date TIMESTAMP,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

## 🔧 New Service Methods

### journalService.getDrafts(userId)
Get all draft entries for a user:
```javascript
const drafts = await journalService.getDrafts(userId);
```

### journalService.publishDraft(entryId)
Convert a draft to published entry:
```javascript
await journalService.publishDraft(draftId);
```

### journalService.getEntries(userId, includeDrafts)
Get entries with optional draft inclusion:
```javascript
// Get only published entries (default)
const entries = await journalService.getEntries(userId);

// Get all entries including drafts
const allEntries = await journalService.getEntries(userId, true);
```

## 📱 User Flow

```
User taps + button
    ↓
Starts writing entry
    ↓
User wants to save for later
    ↓
Taps ✗ close button
    ↓
Dialog: "Save as Draft?"
    ↓
User taps "Save Draft"
    ↓
Entry saved with is_draft=true
    ↓
Success message shown
    ↓
Returns to home
```

## 🎨 Future Enhancements

Ideas for extending the draft feature:

1. **Drafts Tab/Section**
   - Add "Drafts" section to home screen
   - Show list of all draft entries
   - Tap to edit and publish

2. **Draft Badge**
   - Show badge icon on draft entries
   - Display draft count

3. **Auto-save Drafts**
   - Auto-save every 30 seconds while writing
   - Never lose work if app crashes

4. **Draft Reminders**
   - Notify user if drafts are old
   - Suggest finishing drafts

5. **Quick Publish**
   - Swipe action to publish draft
   - Bulk publish multiple drafts

## 🔄 Updating Your Database

To add draft support to existing database, run this SQL in Supabase:

```sql
-- Add is_draft column
ALTER TABLE public.journal_entries
ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT FALSE;

-- Update existing entries to be published (not drafts)
UPDATE public.journal_entries
SET is_draft = FALSE
WHERE is_draft IS NULL;
```

Or just run the entire updated `supabase-setup.sql` file!

## ✅ What's Been Updated

### Files Changed:
1. **supabase-setup.sql** - Added `is_draft` column
2. **journalService.js** - Added draft methods
3. **NewEntryScreen.js** - Added save draft logic
4. **HomeScreen.js** - Filters out drafts by default

### New Features:
- ✅ Save as draft on close
- ✅ Dialog to choose draft vs discard
- ✅ Draft entries in database
- ✅ Separate draft/published logic
- ✅ Draft count excluded from stats

## 🧪 Testing

1. **Test Save Draft**:
   - Open new entry
   - Write something
   - Tap X button
   - Choose "Save Draft"
   - Check database - should have `is_draft=true`

2. **Test Discard**:
   - Open new entry
   - Write something
   - Tap X button
   - Choose "Discard"
   - Entry should not be in database

3. **Test Empty Close**:
   - Open new entry
   - Don't write anything
   - Tap X button
   - Should close immediately (no dialog)

4. **Test Save Published**:
   - Open new entry
   - Write something
   - Tap ✓ button
   - Should save with `is_draft=false`
   - Should appear in main list
