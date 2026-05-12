# marite-vidales-v2

👋 Welcome to marite-vidales-v2! This is the fresh, revamped home for Marite Vidales' personal portfolio. I’ve traded the [old setup](https://github.com/perlajarillo/marite-vidales) for a modern stack to keep things fast, clean, and fun to work on.

**Fun Fact**: This portfolio was built between batches of cinnamon rolls and the occasional home made pan dulce. It's fueled by caffeine and home-grown basil.

## 🛠️ The Tech Stack

- React 19 for the UI

- TypeScript 6 to keep things type-safe

- Vite 8 for that lightning-fast dev experience

- Tailwind CSS 4 for the styling magic

**TIP:**
You can find the full list of every single library and tool used in the package.json file.

## 🏗️ Where things live

- `src/components/` – The heart of the site. This is where all the UI pieces (like the Home page) live.
- `src/assets/` – For images and other media.
- `src/main.tsx & App.tsx` – The "brain" of the app, where everything gets rendered.

- `src/index.css` / `src/App.css` — Global and application styles

- `tsconfig.app.json` / `tsconfig.node.json` — TypeScript project configuration

- Config Files — vite.config.ts, tailwind.config.ts, and tsconfig.json handle the project's "under the hood" settings.

## 🗒️ What you’ll need

| Requirement | Recommended Version           |
| ----------- | ----------------------------- |
| Node.js     | 20.x or later                 |
| npm         | 10.x+ (or Yarn 4 / pnpm 8)    |
| Editor      | VS Code (highly recommended!) |

## 🤓 Getting started

1. Clone the repository:

```bash
git clone https://github.com/your-org/marite-vidales-v2.git
cd marite-vidales-v2
```

2. Install dependencies:

```bash
npm install
```

If you use Yarn:

```bash
yarn install
```

Or pnpm:

```bash
pnpm install
```

3. Start the development server:

```bash
npm run dev
```

Open the local URL printed in the terminal, typically `http://localhost:5173`.

## 💪 Available scripts

- `npm run dev` — run the Vite development server
- `npm run build` — build the production bundle (`tsc -b && vite build`)
- `npm run lint` — run ESLint across the project
- `npm run preview` — preview the production build locally

## 🔢 Recommended workflow

- Use `npm run dev` while you develop
- Run `npm run lint` before committing changes
- Build with `npm run build` to verify production output

## ➕ Adding New Things

### Add a production library

```bash
 npm install <package-name>
```

### Add a development tool (like a new linter plugin)

```bash
npm install -D <package-name>
```

## 😸 How to contribute

### ☺️ The Vibe (Code of Conduct)

- Honor the vision: Please respect what this project represents, it's a personal space and a piece of art.

- Stay respectful: Treat the code and the content with care.

- Have fun: Most importantly, enjoy the process of building something cool! 🍻

### 🔥 The Workflow

- Start from dev: Always make sure you’re branched out from the dev branch rather than main.

- Create a branch: Give your branch a descriptive name (e.g., feat-new-button or fix-header-spacing).

- Do your thing: Work on your changes, commit them, and push them up.

- Show and Tell: In addition to your Pull Request, I’d love for you to do a quick Quality Assurance (QA) review and demo your changes—this helps me see the magic in action!

- Open a PR: Create a Pull Request (PR) against the dev branch. Add a description of what your PR does, include a screenshot when making UI changes.

- Review & Merge: I’ll take a look at the changes and we can chat about any tweaks. Once it looks good, it gets merged into dev.

- Go Live: After we’ve tested everything on dev, I’ll merge it into main and deploy the updates!
