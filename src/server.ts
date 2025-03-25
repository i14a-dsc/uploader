import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 8081;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// File upload middleware
app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 1024 * 1024 * 1024 * 10 }, // 10GB limit
  useTempFiles: true,
  tempFileDir: '/tmp/',
  preserveExtension: true,
  uriDecodeFileNames: true
}));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/upload.html'));
});

// Helper function to generate unique filename
function generateUniqueFilename(originalName: string, filesDir: string): string {
  const decodedName = Buffer.from(originalName, 'latin1').toString('utf8');
  const ext = path.extname(decodedName);
  const baseName = path.basename(decodedName, ext);
  let counter = 1;
  let fileName = decodedName;

  while (fs.existsSync(path.join(filesDir, fileName))) {
    fileName = `${baseName} (${counter})${ext}`;
    counter++;
  }

  return fileName;
}

// API endpoints
app.post('/api/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: 'No files were uploaded.' });
  }

  const uploadedFiles = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
  const uploadResults = [];
  const filesDir = path.join(__dirname, '../files');

  for (const file of uploadedFiles) {
    const fileName = generateUniqueFilename(file.name, filesDir);
    const filePath = path.join(filesDir, fileName);

    try {
      file.mv(filePath);
      uploadResults.push({
        originalName: fileName,
        fileName: fileName,
        size: file.size,
        url: `/files/${fileName}`
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error uploading file.' });
    }
  }

  res.json({ files: uploadResults });
});

app.get('/api/files', (req, res) => {
  const filesDir = path.join(__dirname, '../files');
  
  try {
    const files = fs.readdirSync(filesDir)
      .filter(file => !file.startsWith('.'))
      .map(fileName => {
        const filePath = path.join(filesDir, fileName);
        const stats = fs.statSync(filePath);
        return {
          fileName,
          size: stats.size,
          url: `/files/${fileName}`,
          createdAt: stats.birthtime,
          modifiedAt: stats.mtime
        };
      })
      .sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime());

    res.json({ files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error reading files directory.' });
  }
});

app.delete('/api/files/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, '../files', fileName);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'File deleted successfully.' });
    } else {
      res.status(404).json({ error: 'File not found.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting file.' });
  }
});

app.put('/api/files/:fileName/rename', (req, res) => {
  const oldFileName = req.params.fileName;
  const { newName } = req.body;
  
  if (!newName) {
    return res.status(400).json({ error: 'New name is required.' });
  }

  const filesDir = path.join(__dirname, '../files');
  const uniqueNewName = generateUniqueFilename(newName, filesDir);
  const oldPath = path.join(filesDir, oldFileName);
  const newPath = path.join(filesDir, uniqueNewName);

  try {
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      res.json({ 
        message: 'File renamed successfully.',
        newFileName: uniqueNewName,
        url: `/files/${uniqueNewName}`
      });
    } else {
      res.status(404).json({ error: 'File not found.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error renaming file.' });
  }
});

// File listing page route
app.get('/files', (req, res) => {
  res.send(fs.readFileSync(path.join(__dirname, '../public/files.html'), 'utf8'));
});

// Static file serving for uploaded files
app.use('/files', express.static(path.join(__dirname, '../files')));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
}); 