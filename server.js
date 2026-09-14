const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, {recursive:true});

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_, file, cb) => cb(null, Date.now()+"-"+file.originalname.replace(/[^a-zA-Z0-9._-]/g,"_"))
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/upload", upload.single("video"), async (req,res) => {
  if (!req.file) return res.status(400).json({error:"No video uploaded"});
  // Production pipeline:
  // 1) FFmpeg extracts audio
  // 2) Speech-to-text transcribes dialogue
  // 3) LLM converts transcript + scene information into Khmer narration
  // 4) Khmer TTS creates narration audio
  // 5) FFmpeg mixes narration with the original video and exports MP4
  res.json({
    ok:true,
    filename:req.file.filename,
    originalName:req.file.originalname,
    message:"Video uploaded. Connect the AI providers in /services to enable automatic Khmer narration."
  });
});

app.post("/api/generate", async (req,res) => {
  const {filename, style="movie-recap"} = req.body || {};
  if (!filename) return res.status(400).json({error:"Missing filename"});

  // Demo response. Replace with real provider calls in /services.
  res.json({
    ok:true,
    status:"demo",
    script:`[Demo Khmer narration]\\nរឿងចាប់ផ្តើមដោយតួអង្គសំខាន់ម្នាក់ ដែលកំពុងជួបប្រទះហេតុការណ៍មិនធម្មតា។ បន្ទាប់មក ព្រឹត្តិការណ៍កាន់តែតានតឹង ហើយគាត់ត្រូវស្វែងរកវិធីដោះស្រាយមុនពេលអ្វីៗហួសពេល។\\n\\nStyle: ${style}`,
    note:"This starter version includes the complete UI and API structure. Add your preferred transcription, LLM, Khmer TTS and FFmpeg workers for production."
  });
});

app.get("/api/health", (_,res)=>res.json({ok:true,app:"Trex Story AI"}));

app.listen(PORT, ()=>console.log(`Trex Story AI running at http://localhost:${PORT}`));
