import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Note from './models/Note.js';
import { connectDB } from './config/db.js';

dotenv.config();

const sampleNotes = [
  {
    title: '🚀 MERN Stack Architecture Overview',
    content: 'Full-stack application structured into:\n- Frontend: React (Vite) + CSS Variables + Axios\n- Backend: Express.js REST API with clean MVC structure\n- Database: MongoDB with Mongoose schema validation\n- Features: Full CRUD, real-time debounced search, category filtering, and tag management.',
    category: 'Work',
    tags: ['mern', 'architecture', 'react', 'express', 'mongodb'],
    isPinned: true,
  },
  {
    title: '📚 System Design & Database Indexing',
    content: 'Key concepts to remember for technical evaluations:\n1. Compound Indexes: e.g. { isPinned: -1, createdAt: -1 } for fast sorted retrieval.\n2. Text Search: MongoDB text indexes support multi-field querying.\n3. Separation of Concerns: Route handling, controller logic, and database schemas should remain decoupled.',
    category: 'Study',
    tags: ['database', 'indexing', 'system-design', 'interview'],
    isPinned: true,
  },
  {
    title: '💡 NoteNest Product Roadmap & Ideas',
    content: 'Exciting future enhancements to consider:\n- Markdown live preview and code snippet formatting\n- Cloud backup with MongoDB Atlas\n- Note color themes and archive folders\n- Export notes as PDF or Markdown files',
    category: 'Ideas',
    tags: ['roadmap', 'features', 'brainstorming'],
    isPinned: false,
  },
  {
    title: '🏃 Daily Routine & Wellness Goals',
    content: 'Morning habits for high productivity:\n1. 20-minute morning jog or stretch\n2. Plan top 3 priority tasks before checking email\n3. Drink 2L of water throughout the day\n4. 30 minutes of deep reading or skill building in the evening.',
    category: 'Personal',
    tags: ['health', 'habits', 'productivity'],
    isPinned: false,
  },
  {
    title: '🛠️ Helpful Git Commands & Quick Reference',
    content: 'Useful git commands:\n- git status: check current working directory\n- git add . && git commit -m "feat: your message"\n- git log --oneline -n 5: review recent commits\n- git checkout -b feature/new-component: branch off',
    category: 'General',
    tags: ['git', 'cheatsheet', 'terminal'],
    isPinned: false,
  },
  {
    title: '☕ Weekly Sprint Planning Notes',
    content: 'Sprint 14 Priorities:\n- Complete frontend and backend CRUD integration\n- Ensure error boundaries and friendly toast alerts\n- Test responsiveness on mobile and tablet viewport widths\n- Final code cleanup and documentation polish.',
    category: 'Work',
    tags: ['sprint', 'scrum', 'team'],
    isPinned: false,
  },
];

const seedDatabase = async () => {
  try {
    console.log('Checking if backend API is running on http://localhost:5000...');
    let apiAvailable = false;
    try {
      const res = await fetch('http://localhost:5000/api/health');
      if (res.ok) apiAvailable = true;
    } catch {
      apiAvailable = false;
    }

    if (apiAvailable) {
      console.log('Backend server detected at http://localhost:5000. Seeding via REST API...');
      // Clear existing notes if any
      const existingRes = await fetch('http://localhost:5000/api/notes');
      const existingNotes = await existingRes.json();
      if (Array.isArray(existingNotes) && existingNotes.length > 0) {
        console.log(`Found ${existingNotes.length} existing notes. Removing old notes...`);
        for (const n of existingNotes) {
          await fetch(`http://localhost:5000/api/notes/${n._id}`, { method: 'DELETE' });
        }
      }

      console.log(`Inserting ${sampleNotes.length} sample notes via API...`);
      for (const noteData of sampleNotes) {
        const postRes = await fetch('http://localhost:5000/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(noteData),
        });
        const created = await postRes.json();
        console.log(` - [${created.category}] ${created.title} (Pinned: ${created.isPinned})`);
      }
      console.log('Successfully seeded notes into running server!');
      process.exit(0);
    }

    console.log('Backend server not running. Connecting directly to database...');
    await connectDB();

    const count = await Note.countDocuments();
    if (count > 0) {
      console.log(`Database already has ${count} notes. Clearing existing collection...`);
      await Note.deleteMany({});
    }

    console.log(`Inserting ${sampleNotes.length} sample notes directly into MongoDB...`);
    const created = await Note.insertMany(sampleNotes);
    console.log(`Successfully seeded ${created.length} notes!`);
    created.forEach((n) => {
      console.log(` - [${n.category}] ${n.title} (Pinned: ${n.isPinned})`);
    });

    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
