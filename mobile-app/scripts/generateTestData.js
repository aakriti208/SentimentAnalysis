import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Sample journal titles
const titles = [
  "A Beautiful Morning",
  "Thoughts on Life",
  "Coffee Shop Reflections",
  "Weekend Adventures",
  "Gratitude Journal",
  "Learning and Growth",
  "Rainy Day Thoughts",
  "Evening Reflections",
  "New Beginnings",
  "Peaceful Moments",
  "Challenges and Wins",
  "Summer Days",
  "Winter Memories",
  "Spring Awakening",
  "Autumn Reflections",
  "Family Time",
  "Work Progress",
  "Personal Goals",
  "Creative Ideas",
  "Mindfulness Practice",
  "Travel Dreams",
  "Health Journey",
  "Reading Notes",
  "Music and Mood",
  "Nature Walk",
  "City Exploration",
  "Quiet Evening",
  "Busy Day",
  "Weekend Plans",
  "Monthly Review",
  "Daily Wins",
  "Lessons Learned",
  "Happy Moments",
  "Overcoming Obstacles",
  "Future Plans",
  "Past Reflections",
  "Present Awareness",
  "Inner Peace",
  "Productivity Tips",
  "Self Care Day",
  "Friendship Memories",
  "Cooking Experiments",
  "Fitness Progress",
  "Meditation Session",
  "Creative Writing",
  "Problem Solving",
  "Achievement Unlocked",
  "Random Thoughts",
  "Life Updates",
  "Dream Journal"
];

// Sample journal content
const contentTemplates = [
  "Today was an amazing day. I woke up feeling refreshed and ready to tackle the world. The morning sun streaming through my window reminded me of how blessed I am to experience another day.",
  "Reflecting on my journey so far, I realize how much I've grown. The challenges I faced yesterday seem manageable today. Growth is a continuous process.",
  "Sometimes the smallest moments bring the greatest joy. Today I noticed the birds singing outside my window, and it made me smile.",
  "I'm grateful for the people in my life who support and encourage me. Their presence makes every day brighter and more meaningful.",
  "Today I learned something new about myself. I'm capable of more than I thought. This realization fills me with confidence and excitement.",
  "The weather today perfectly matched my mood. There's something peaceful about watching the rain while sipping a warm cup of tea.",
  "I accomplished something today that I've been putting off for weeks. The sense of relief and achievement is incredible.",
  "Today reminded me to slow down and appreciate the present moment. Life moves so fast, but it's important to pause and breathe.",
  "I faced a challenge today and handled it with grace. I'm proud of how I responded and what I learned from the experience.",
  "This evening I took time to reflect on my goals and dreams. It's important to check in with myself regularly and adjust my path as needed.",
  "Today was productive and fulfilling. I made progress on my projects and felt a sense of purpose throughout the day.",
  "I spent quality time with loved ones today. These connections remind me what truly matters in life.",
  "Reading a good book today opened my mind to new perspectives. Literature has a way of expanding our horizons.",
  "Today I practiced mindfulness and felt more present in each moment. It's amazing how awareness can transform ordinary experiences.",
  "I'm working on being more patient with myself. Progress isn't always linear, and that's okay. Every step forward counts.",
  "Today brought unexpected surprises and delightful moments. Life has a way of surprising us when we least expect it.",
  "I'm learning to embrace uncertainty and trust the journey. Not knowing what comes next can be exciting rather than scary.",
  "Today I felt deeply connected to my purpose. When we align with our values, everything flows more naturally.",
  "I took time for self-care today and feel recharged. Taking care of ourselves isn't selfish—it's necessary.",
  "Looking back at where I was a year ago, I can see how much I've evolved. Change happens gradually but surely."
];

// Function to generate random date within last 90 days
function getRandomPastDate() {
  const today = new Date();
  const daysAgo = Math.floor(Math.random() * 90); // Random day in last 90 days
  const date = new Date(today);
  date.setDate(date.getDate() - daysAgo);

  // Random time of day
  const hour = Math.floor(Math.random() * 24);
  const minute = Math.floor(Math.random() * 60);
  date.setHours(hour, minute, 0, 0);

  return date.toISOString();
}

// Function to get random item from array
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Function to generate journal entries
async function generateTestData(userId, count = 50) {
  console.log(`🚀 Generating ${count} test journal entries...`);

  const entries = [];

  for (let i = 0; i < count; i++) {
    const date = getRandomPastDate();
    const title = getRandomItem(titles);
    const content = getRandomItem(contentTemplates);

    entries.push({
      user_id: userId,
      title: title,
      content: content,
      date: date,
      created_at: date,
      updated_at: date,
    });
  }

  // Sort by date (oldest first)
  entries.sort((a, b) => new Date(a.date) - new Date(b.date));

  console.log('📝 Inserting entries into database...');

  const { data, error } = await supabase
    .from('journal_entries')
    .insert(entries)
    .select();

  if (error) {
    console.error('❌ Error inserting data:', error);
    throw error;
  }

  console.log(`✅ Successfully inserted ${data.length} journal entries!`);
  console.log('\n📊 Date Range:');
  console.log(`   Oldest: ${new Date(entries[0].date).toLocaleDateString()}`);
  console.log(`   Newest: ${new Date(entries[entries.length - 1].date).toLocaleDateString()}`);

  return data;
}

// Main function
async function main() {
  try {
    // Get current user ID (you need to be logged in)
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('❌ Not authenticated. Please login first.');
      console.log('\n💡 You can login by running the app and signing in,');
      console.log('   then run this script again.');
      process.exit(1);
    }

    console.log(`👤 User ID: ${user.id}`);
    console.log(`📧 Email: ${user.email}\n`);

    // Generate test data
    await generateTestData(user.id, 50);

    console.log('\n🎉 Done! Check your journal app to see the entries.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
