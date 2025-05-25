const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// dummy auth
app.use((req, res, next) => {
  const id = parseInt(req.header('x-user-id')) || 1;
  const role = req.header('x-user-role') || 'USER';
  req.user = { id, role };
  next();
});

// file upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:  (req, file, cb) => cb(null, Date.now()+path.extname(file.originalname))
});
const upload = multer({ storage });

// Branch & semester & subject listings 
app.get('/branches', async (req, res) => {
  const branches = await prisma.branch.findMany();
  res.json(branches);
});
app.get('/branches/:bid/semesters', async (req, res) => {
  const sems = await prisma.semester.findMany({
    where: { branchId: +req.params.bid }
  });
  res.json(sems);
});
app.get('/semesters/:sid/subjects', async (req, res) => {
  const subs = await prisma.subject.findMany({
    where: { semesterId: +req.params.sid }
  });
  res.json(subs);
});

//  Uploads 
app.get('/subjects/:sid/uploads', async (req, res) => {
  const ups = await prisma.upload.findMany({
    where: { subjectId: +req.params.sid },
    include: { user: true }
  });
  res.json(ups);
});
app.post('/subjects/:sid/uploads', upload.single('file'), async (req, res) => {
  const { title } = req.body;
  const fileUrl = `/uploads/${req.file.filename}`;
  const up = await prisma.upload.create({
    data: {
      title,
      url: fileUrl,
      subjectId: +req.params.sid,
      userId: req.user.id
    }
  });
  res.json(up);
});
app.delete('/uploads/:id', async (req, res) => {
  const u = await prisma.upload.delete({ where: { id: +req.params.id } });
  res.json(u);
});

//  Discussions
app.get('/subjects/:sid/discussions', async (req, res) => {
  const ds = await prisma.discussion.findMany({
    where: { subjectId: +req.params.sid },
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(ds);
});
app.post('/subjects/:sid/discussions', async (req, res) => {
  const { content } = req.body;
  const d = await prisma.discussion.create({
    data: {
      content,
      subjectId: +req.params.sid,
      userId: req.user.id
    }
  });
  res.json(d);
});

//  Labs 
app.get('/subjects/:sid/labs', async (req, res) => {
  const ls = await prisma.labMaterial.findMany({
    where: { subjectId: +req.params.sid },
    include: { user: true }
  });
  res.json(ls);
});
app.post('/subjects/:sid/labs', upload.single('file'), async (req, res) => {
  const { title } = req.body;
  const url = `/uploads/${req.file.filename}`;
  const l = await prisma.labMaterial.create({
    data: {
      title,
      url,
      subjectId: +req.params.sid,
      userId: req.user.id
    }
  });
  res.json(l);
});
app.delete('/labs/:id', async (req, res) => {
  const l = await prisma.labMaterial.delete({ where: { id: +req.params.id } });
  res.json(l);
});

app.listen(process.env.PORT, () =>
  console.log(` Backend running on http://localhost:${process.env.PORT}`)
);
