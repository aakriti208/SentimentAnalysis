import { createSlice } from '@reduxjs/toolkit';
import { format, parseISO, differenceInCalendarDays } from 'date-fns';

const initialState = {
  entries: [],
  loading: false,
  error: null,
};

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    addEntry: (state, action) => {
      state.entries.push(action.payload);
    },
    setEntries: (state, action) => {
      state.entries = action.payload;
    },
    updateEntry: (state, action) => {
      const index = state.entries.findIndex(entry => entry.id === action.payload.id);
      if (index !== -1) {
        state.entries[index] = action.payload;
      }
    },
    deleteEntry: (state, action) => {
      state.entries = state.entries.filter(entry => entry.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { addEntry, setEntries, updateEntry, deleteEntry, setLoading, setError } = journalSlice.actions;

// Selectors
export const selectAllEntries = (state) => state.journal.entries;

export const selectEntryCount = (state) => state.journal.entries.length;

export const selectCurrentStreak = (state) => {
  const entries = state.journal.entries;
  if (entries.length === 0) return 0;

  // Sort entries by date descending
  const sortedEntries = [...entries].sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedEntries.length; i++) {
    const entryDate = parseISO(sortedEntries[i].date);
    entryDate.setHours(0, 0, 0, 0);

    const daysDiff = differenceInCalendarDays(currentDate, entryDate);

    if (daysDiff === streak) {
      streak++;
      currentDate = entryDate;
    } else if (daysDiff > streak) {
      break;
    }
  }

  return streak;
};

export const selectMarkedDates = (state) => {
  const entries = state.journal.entries;
  const marked = {};

  entries.forEach(entry => {
    const dateStr = format(parseISO(entry.date), 'yyyy-MM-dd');
    marked[dateStr] = {
      marked: true,
      dotColor: '#5B8DEF',
      activeOpacity: 0.5,
    };
  });

  return marked;
};

export default journalSlice.reducer;
