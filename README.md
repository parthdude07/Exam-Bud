## STEPS

Thought there would be a lot of steps, hehe ?

```bash
docker-compose up --build -d
```

Before you do all of these -- 

In the backend folder change the name of the file `.env.sample` to only `.env`

Do a `npm install` inside the frontend and backend directory both, and yeah have docker installed and the docker daemon should be running behind in your local machine. 🙂

```bash
cd <project-name>
```

```bash
cd backend
npm install
```

Do a `cd ..` to get out of the backend directory so that you can move into the frontend one. You can either do this or open a new terminal and run your frontend directory commands there. Your choice !!

```bash
cd frontend
npm install
```

Do a `cd ..` to get out of the frontend directory so that you can move out to the root project directory. You can either do this or open a new terminal. Your choice !!

```bash
cd ..
docker-compose up --build -d
```
NOTE - The `docker compose` command is to be ran at the `root`. This means you need to run this when your terminal shows you are in `exam-bud` only, not inside any other directory of `exam-bud`

After everything has ran successfully check for something like this -- 

<img width="825" alt="Screenshot 2025-05-26 at 2 48 25 AM" src="https://github.com/user-attachments/assets/bc617a55-7945-421f-bb26-8c21b2295e63" />

Voila, you are done with the setup !

Open your favourite browser, in the url portion type `localhost:3001` pray to God, and hit enter. You should be able to access the website. 

Have doubts? Ping me up personally on discord or use the `exam-bud-discussions` public discord channel and yeah do tag me as well !!


After the session I will be adding the resources underneath here and you guys can always take a look into that for Git Commands and Setup
