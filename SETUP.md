# 🚀 Exam-Bud Setup Guide
### *Your Ultimate Survival Guide to Getting This Beast Running*

You're about to set up **Exam-Bud** - the open-source project that's going to revolutionize how we survive exams in enineering college. This isn't just another website; it's your digital lifeline when you're drowning in syllabus three days before finals (we've all been there, don't lie).

---

## ⚡ TL;DR - For the Impatient Souls

*Thought there would be a lot of steps, hehe?*

Just run this and pray to the tech gods:
```bash
docker compose up --build -d
```

**BUT WAIT!** Don't be that person who skips the setup and then complains in the group chat at midnight. Read the full guide below, future you will thank present you.

---

## 🛠️ Pre-Flight Checklist: The Sacred Prerequisites

Before we dive into the chaos, let's make sure you have the essentials. Think of this as your pre-exam checklist, but for code:

### ✅ Essential Tools

1. **Docker** 🐳
   - Download from [Docker's official website](https://www.docker.com/get-started)
   - Make sure the Docker daemon is running (you'll see a cute whale icon in your system tray)
   - If Docker gives you installation errors, take a deep breath. We've all been there. Check the troubleshooting section below.

2. **Node.js** 🟢
   - Get it from [nodejs.org](https://nodejs.org/)
   - We're not picky about versions, but don't use something from 2015 please

3. **Git** (You should already have this if you're reading this)
   - If not, dive in this cool [Docs](https://medium.com/@ritankar.saha786/understanding-git-and-github-b79bb84de9e8)
   - Yes, it's that simple

### 🧠 Mental Preparation
- Accept that something will probably go wrong
- Have your favorite debugging playlist ready
- Keep some coffee/chai nearby
- Remember: if it works on the first try, you're either a wizard or something's definitely wrong

---

## 🎬 The Main Event: Setup Steps

### Step 1: Enter the Project Directory
```bash
cd <project-name>
```
*Replace `<project-name>` with `Exam-bud`.*

### Step 2: Backend Magic ✨

Navigate to the backend and install dependencies:
```bash
cd backend
npm install
```

**Pro Tip:** While npm install is running, this is the perfect time to:
- Question why you chose engineering
- Pray that no dependency conflicts arise

**IMPORTANT:** Rename `.env.sample` to `.env`:
- **Windows:** Right-click → Rename → Remove ".sample"
- **Mac/Linux:** `mv .env.sample .env`
- **Why?** Because this file contains all the secret sauce (database configs, API keys, etc.)

### Step 3: Frontend Wizardry 🎨

Exit backend and enter frontend:
```bash
cd ..          # Escape from backend
cd frontend    # Enter the realm of JavaScript chaos
npm install    # Summon the node_modules demon
```

### Step 4: Return to Base (Root Directory)

```bash
cd ..    # Back to the root, where all the magic happens
```

### Step 5: The Final Summoning Ritual 🔮

```bash
docker compose up --build -d
```

**What does this do?**
- `docker compose up`: Starts all the containers
- `--build`: Rebuilds images if needed (covers your back if you made changes)
- `-d`: Runs in detached mode (so you can use your terminal for other important things like memes)

---

## 🎉 Victory Dance Time!

If everything worked, you should see something like this in your terminal:

![Success Screenshot](https://github.com/user-attachments/assets/bc617a55-7945-421f-bb26-8c21b2295e63)

**The Moment of Truth:**
1. Open your favorite browser (we don't judge, even if it's Internet Explorer... okay, we judge a little)
2. Navigate to `localhost:3001`
3. Take a deep breath, close your eyes, and hit Enter
4. If you see the Exam-Bud interface, congratulations! You've successfully summoned the project from the digital depths! 🧙‍♂️✨

---

## 🆘 When Things Go Wrong (They Will)

### Common Issues & Solutions

#### "Docker not found" or "Docker daemon not running"
- **Windows:** Check if Docker Desktop is actually running (not just installed)
- **Mac:** Same as Windows, look for the whale icon
- **Linux:** `sudo systemctl start docker`

#### "npm install" taking forever
- This is normal. npm has a special relationship with time and space.
- If it's been more than 10 minutes, try `npm cache clean --force` and retry
- If it's still stuck, check your internet connection or blame your ISP

#### "Permission denied" errors
- **Linux/Mac:** You might need `sudo` for some operations
- **Windows:** Run terminal as Administrator
- If all else fails, Google the exact error message (we've all been there)

#### "Port 3001 already in use"
- Something else is using that port
- Kill whatever's using it: `lsof -ti:3001 | xargs kill -9` (Mac/Linux)
- Or just use a different port by modifying the docker-compose file

---

## 📚 Resources & Further Reading

- get familiar with techstacks, go through [README.md](./READMEmd)
- dont know how to contribute to the project? refer [CONTRIBUTING.md](./CONTRIBUTING.md)
- "How to survive coding at 2 AM" - A survival guide

## 🎯 Final Words of Wisdom

Remember, you're not just setting up a project - you're contributing to something that will help thousands of students survive their academic journey. Every npm install, every Docker build, every moment of frustration is building something bigger than yourself.

And if this setup guide made you chuckle even once, then it's already served its purpose. **Engineering** is hard enough without boring documentation.

Now go forth, set up this project, and may your builds be fast and your bugs be few! 🚀

---

**Pro Life Tip:** Bookmark this guide. You'll probably need it again when you inevitably forget how you set this up the first time. We've all been there, and we're all lying if we say we haven't.

*Happy coding, and may your notes always be complete!* 📚✨

---

*Made with ❤️, ☕, and a healthy dose of procrastination by the Exam-Bud team*
