# Splunk Home Lab Learning Simulator 🟢

An interactive web-based simulator to learn Splunk architecture, data flow, and `.conf` files. Built for hands-on learning without needing a live Splunk instance.

## Features

- **🏗️ Architecture Diagram** — Visual data flow from sources → forwarders → indexers → search heads. Click any component for details.
- **📄 .conf Explorer** — Deep dive into every major .conf file with sample configs, location matrix, and gotchas.
- **📚 Learning Mode** — Flip cards covering 10 core Splunk concepts with real-world analogies.
- **🧪 Scenarios** — Step-by-step guides for common tasks (onboard logs, route data, deploy apps).
- **✅ Quiz** — 15 questions to test your knowledge with explanations.
- **🔍 Search** — Quick search across all components, configs, and concepts (⌘K).

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Zero external UI libraries

## Setup

```bash
git clone https://github.com/chrissytin/splunk-lab-simulator.git
cd splunk-lab-simulator
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
```

## Deploy

```bash
npx vercel --prod
```

## License

MIT
