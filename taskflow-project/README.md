# TaskFlow — make room for what matters

TaskFlow is an original, responsive task tracker built with plain HTML, CSS, and TypeScript. It demonstrates a typed task model, typed DOM access, model-driven UI updates, and compilation to browser-ready JavaScript.

## Features

- Add tasks with a starting status (`todo`, `in-progress`, or `done`)
- Advance status with one click; completed tasks can cycle back to `todo`
- Filter by status and search task titles
- Delete individual tasks or clear all completed tasks
- Summary counts and local browser storage
- Responsive layout, keyboard support, and accessible button labels

## Run locally

You need Node.js and the TypeScript compiler (`tsc`). From this folder:

```bash
tsc
```

A successful compile prints no errors and produces/updates `app.js` and `model.js`. Because this uses JavaScript modules, run it through a local static server rather than opening `index.html` directly. For example, if Python is installed:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Test before submitting

1. Add a task with each of the three starting statuses.
2. Advance a `todo` task to `in-progress`, then to `done`.
3. Use each filter and search for a task by title.
4. Delete a task and clear completed tasks.
5. Refresh the page and verify tasks remain saved.
6. Run `tsc` and confirm there are no errors.

## Publish with GitHub Pages

1. Push this project to your public GitHub repository.
2. Open the repository's **Settings → Pages**.
3. Under build/deployment, choose **Deploy from a branch**.
4. Select the `main` branch and `/(root)`, then save.
5. Wait for the Pages deployment. The URL is usually `https://YOUR-USERNAME.github.io/YOUR-REPO/`.
6. Open the live URL and test the app again.

## Assignment submission

Follow your course instructions to work on a new branch and open a pull request into `main`. Include both the repository URL and the deployed URL in the pull request description. If your Part 1 repository already contains a `model.ts` and `tsconfig.json`, compare them with these files before replacing anything; preserve your existing repository and merge the UI work into it as required by your course.

## Project files

- `model.ts` — typed Task model and task operations
- `app.ts` — typed DOM wiring, filters, rendering, and persistence
- `index.html` — accessible UI structure
- `styles.css` — original responsive visual design
- `tsconfig.json` — strict TypeScript compiler settings
- `app.js`, `model.js` — compiled JavaScript loaded by the browser
