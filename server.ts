import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const db = new Database("stories.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    initial TEXT NOT NULL,
    initialBg TEXT NOT NULL,
    name TEXT NOT NULL,
    time TEXT NOT NULL,
    tag TEXT NOT NULL,
    tagColor TEXT NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    supports INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    story_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    initial TEXT NOT NULL,
    initialBg TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE CASCADE
  );
`);

// Insert initial data if empty
const count = db.prepare("SELECT COUNT(*) as count FROM stories").get() as { count: number };
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO stories (initial, initialBg, name, time, tag, tagColor, title, excerpt, likes, supports, comments)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  insert.run("A", "bg-green-100 text-green-600", "Anonim123", "1 jam yang lalu", "sedih", "bg-blue-50 text-blue-500", "Hari ini terasa sangat berat...", "Saya merasa sangat lelah dengan semua ini. Rasanya seperti memikul beban yang sangat berat sendirian. Tidak ada tempat untuk berbagi, dan saya bingung harus mulai dari mana.", 28, 50, 0);
  insert.run("B", "bg-purple-100 text-purple-600", "BintangKecil", "2 jam yang lalu", "marah", "bg-purple-50 text-purple-500", "Mencoba bangkit kembali", "Setelah sekian lama terpuruk, hari ini saya memutuskan untuk mengambil langkah kecil. Memang tidak mudah, tapi saya yakin pelan-pelan semua akan membaik. Terima kasih untuk dukungan teman-teman di sini.", 24, 30, 0);
  insert.run("P", "bg-orange-100 text-orange-600", "PejuangSenja", "5 jam yang lalu", "bingung", "bg-orange-50 text-orange-500", "Lelah berpura-pura baik saja", "Di depan semua orang saya selalu tersenyum, seolah tidak ada masalah. Tapi di malam hari, rasanya sangat sepi. Apakah ada yang pernah merasa seperti ini? Bagaimana kalian menghadapinya?", 18, 20, 0);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/stories", (req, res) => {
    const { q } = req.query;
    if (q) {
      const stories = db.prepare("SELECT * FROM stories WHERE title LIKE ? OR excerpt LIKE ? OR name LIKE ? ORDER BY created_at DESC").all(`%${q}%`, `%${q}%`, `%${q}%`);
      res.json(stories);
    } else {
      const stories = db.prepare("SELECT * FROM stories ORDER BY created_at DESC").all();
      res.json(stories);
    }
  });

  app.get("/api/stories/:id", (req, res) => {
    const { id } = req.params;
    const story = db.prepare("SELECT * FROM stories WHERE id = ?").get(id);
    if (story) {
      res.json(story);
    } else {
      res.status(404).json({ error: "Cerita tidak ditemukan" });
    }
  });

  app.post("/api/stories/:id/like", (req, res) => {
    const { id } = req.params;
    db.prepare("UPDATE stories SET likes = likes + 1 WHERE id = ?").run(id);
    const story = db.prepare("SELECT likes FROM stories WHERE id = ?").get(id);
    res.json(story);
  });

  app.post("/api/stories/:id/support", (req, res) => {
    const { id } = req.params;
    db.prepare("UPDATE stories SET supports = supports + 1 WHERE id = ?").run(id);
    const story = db.prepare("SELECT supports FROM stories WHERE id = ?").get(id);
    res.json(story);
  });

  app.get("/api/stories/:id/comments", (req, res) => {
    const { id } = req.params;
    const comments = db.prepare("SELECT * FROM comments WHERE story_id = ? ORDER BY created_at DESC").all(id);
    res.json(comments);
  });

  app.post("/api/stories/:id/comments", (req, res) => {
    const { id } = req.params;
    const { name, content } = req.body;
    
    const initial = name ? name.charAt(0).toUpperCase() : "A";
    const colors = [
      "bg-green-100 text-green-600",
      "bg-purple-100 text-purple-600",
      "bg-orange-100 text-orange-600",
      "bg-blue-100 text-blue-600",
      "bg-pink-100 text-pink-600"
    ];
    const initialBg = colors[Math.floor(Math.random() * colors.length)];

    const insert = db.prepare(`
      INSERT INTO comments (story_id, name, initial, initialBg, content)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    const info = insert.run(id, name || "Anonim", initial, initialBg, content);
    
    // Update comment count in stories table
    db.prepare("UPDATE stories SET comments = comments + 1 WHERE id = ?").run(id);
    
    res.json({ id: info.lastInsertRowid, success: true });
  });

  app.post("/api/stories", (req, res) => {
    const { name, tag, title, excerpt } = req.body;
    
    // Generate random colors and initials
    const initial = name ? name.charAt(0).toUpperCase() : "A";
    const colors = [
      "bg-green-100 text-green-600",
      "bg-purple-100 text-purple-600",
      "bg-orange-100 text-orange-600",
      "bg-blue-100 text-blue-600",
      "bg-pink-100 text-pink-600"
    ];
    const tagColors = [
      "bg-blue-50 text-blue-500",
      "bg-purple-50 text-purple-500",
      "bg-orange-50 text-orange-500",
      "bg-green-50 text-green-500",
      "bg-pink-50 text-pink-500"
    ];
    
    const initialBg = colors[Math.floor(Math.random() * colors.length)];
    const tagColor = tagColors[Math.floor(Math.random() * tagColors.length)];
    const time = "Baru saja";
    
    const insert = db.prepare(`
      INSERT INTO stories (initial, initialBg, name, time, tag, tagColor, title, excerpt, likes, supports, comments)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const info = insert.run(initial, initialBg, name || "Anonim", time, tag || "cerita", tagColor, title, excerpt, 0, 0, 0);
    res.json({ id: info.lastInsertRowid, success: true });
  });

  app.delete("/api/stories/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM stories WHERE id = ?").run(id);
    res.json({ success: true });
  });

  app.post("/api/subscribe", (req, res) => {
    const { email } = req.body;
    try {
      const insert = db.prepare("INSERT INTO subscribers (email) VALUES (?)");
      const info = insert.run(email);
      res.json({ id: info.lastInsertRowid, success: true });
    } catch (err: any) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        res.status(400).json({ error: "Email sudah terdaftar" });
      } else {
        res.status(500).json({ error: "Terjadi kesalahan" });
      }
    }
  });

  app.get("/api/subscribers", (req, res) => {
    const subs = db.prepare("SELECT * FROM subscribers ORDER BY created_at DESC").all();
    res.json(subs);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
