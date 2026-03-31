import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadPath = 'src/uploads/resumes';
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadPath),
  filename: (_, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  },
});

const fileFilter = (_, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== '.pdf') {
    return cb(new Error('Only PDF files allowed'));
  }
  cb(null, true);
};

export const uploadResume = multer({ storage, fileFilter });
