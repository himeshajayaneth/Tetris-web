# 🕹️ Tetris: Neon Fusion
### *Developed by Himesha Jayaneth • Crafted in Sri Lanka 🇱🇰*

<p align="center">
  <img src="assets/hero.svg" alt="Tetris Neon Hero" width="100%" style="border-radius: 15px; border: 2px solid #00E5FF;" />
</p>

<p align="center">
  <a href="https://himeshajayaneth.github.io/Tetris" target="_blank">
    <img src="https://img.shields.io/badge/PLAY_LIVE-NOW-FF004D?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live Demo"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Author-Himesha_Jayaneth-00E5FF?style=for-the-badge&logo=github" alt="Author"/>
  <img src="https://img.shields.io/badge/Origin-Sri_Lanka-FF4B2B?style=for-the-badge" alt="Sri Lanka"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License"/>
</p>

---

## Table of Contents
- [About the Project](#-about-the-project)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [How to Play](#-how-to-play)
  - [Scoring & Tips](#scoring--tips)
- [Arcade Gallery](#-arcade-gallery)
- [Controls](#-controls)
- [Development & Run Locally](#-development--run-locally)
- [Deploy to GitHub Pages](#-deploy-to-github-pages)
- [Contribution & Feedback](#-contribution--feedback)
- [Roadmap](#-roadmap)
- [Credits & Assets](#-credits--assets)
- [License](#-license)
- [Contact](#-contact)

---

## 🌟 About the Project
**Tetris: Neon Fusion** is a high-performance, modern reimagining of the world's most famous puzzle game. This project showcases smooth 60FPS animations, advanced collision physics (SRS), a neon aesthetic, and mobile-ready controls.

> "A tribute to classic gaming, engineered with modern web standards." — **Himesha Jayaneth**

---

## 🛠️ Tech Stack
| Component | Technology |
| :--- | :--- |
| **Engine** | HTML5 Canvas API |
| **Logic** | Vanilla JavaScript (ES6+) |
| **Styling** | CSS3 (Flexbox / Grid) |
| **Deployment** | GitHub Pages |

---

## ✨ Features
- ⚡ **Precision SRS:** Professional Super Rotation System with wall-kick logic for I and JLSTZ pieces.
- 🌈 **Visual Flair:** Neon palette, subtle glow & shadow effects, and an accurate Ghost landing guide.
- 🔁 **Hold / Swap:** You can hold one piece (press `C`) and swap it into play.
- 📱 **Touch Controls:** Full mobile support via on-screen buttons.
- 🔊 **Sound Effects:** Lightweight WebAudio tones with toggle.
- 🏆 **High Score:** Saved to `localStorage` so your best run is persistent.
- ✅ **Accessibility:** Large buttons and configurable controls (keyboard + touch).

---

## ⌨️ How to Play
Drop, rotate, and arrange classic tetrominos to complete horizontal lines.

- Pieces fall automatically; build complete rows to clear them and score points.
- Use Hold (`C`) to store a piece for later — standard Tetris rule: one hold per piece spawn.
- The Ghost piece shows where the active piece will land.

### Scoring & Tips
- Score is based on line clears: 1 line = small points, 4 lines (Tetris) = big points.
- Tips:
  - Use the Ghost to plan hard-drops safely.
  - Hold an I-piece if you want to set up a Tetris (4-line clear).
  - Use wall-kicks (rotate near walls) to maneuver tight fits.

---

## 📸 Arcade Gallery
<p align="center">
  <a href="ss/ScreenShot_20260302215638.png" target="_blank" title="Level Progression"><img src="ss/ScreenShot_20260302215638.png" alt="Level Progression" width="300" style="margin:6px; border-radius:10px; border: 1px solid #333;"/></a>
  <a href="ss/ScreenShot_20260302215628.png" target="_blank" title="Smooth Rotations"><img src="ss/ScreenShot_20260302215628.png" alt="Smooth Rotations" width="300" style="margin:6px; border-radius:10px; border: 1px solid #333;"/></a>
  <a href="ss/ScreenShot_20260302215620.png" target="_blank" title="Mobile Interface"><img src="ss/ScreenShot_20260302215620.png" alt="Mobile Interface" width="300" style="margin:6px; border-radius:10px; border: 1px solid #333;"/></a>
</p>

*Click any image to open the full-size screenshot in a new tab.*

---

## 📰 Press kit
We've included a small press kit to help you showcase this project.

What's inside `assets/`:
- `hero.svg` — large hero artwork (vector) suitable for README and social sharing.
- `demo.svg` — static demo preview image.
- `screenshot1.svg` — stylized screenshot.

Usage guidelines:
- You may use these assets in your blog post or portfolio. For brand consistency, keep the `Neon Fusion` name and credit the author: **Himesha Jayaneth**.
- If you modify assets, state that they were adapted and include a link back to the repo.

Need a PNG or specific size? Ask and I can export optimized PNGs or a GIF for the README.

---

## 🔗 Embed the live game (iframe)
If you want to embed the live demo on a blog or portfolio page, use an iframe referencing the GitHub Pages URL (replace `himeshajayaneth` with your username if you deploy):

```html
<iframe src="https://himeshajayaneth.github.io/Tetris" width="800" height="640" style="border:1px solid #222; border-radius:8px;" title="Tetris: Neon Fusion"></iframe>
```

Note: Some platforms don't allow iframes from GitHub Pages. As an alternative, link to the live demo or embed a demo GIF.

---

## 📣 Social share (copy-ready)
Use this short blurb when posting your demo on Twitter / LinkedIn:

> Just launched "Tetris: Neon Fusion" — a modern HTML5 Canvas reimagining of Tetris with SRS rotation, mobile controls, and neon visuals. Play live: https://himeshajayaneth.github.io/Tetris

Add `#webdev #gamedev #javascript` to reach the right audience.

---

## 💖 Sponsor / Donate (optional)
If you'd like to support ongoing improvements (assets, music, hosting), you can add a sponsor link or donation button here. Example markdown (replace the URL with your sponsor/donation link):

```markdown
[Buy me a coffee](https://www.buymeacoffee.com/yourname)
```

This is optional — let me know if you want me to wire a donation button into the page.

---

## 🧭 Development & Run Locally
Recommended: use a local static server for best browser behavior (audio contexts and service behaviors work more reliably).

1. Clone the repository:

```powershell
git clone https://github.com/himeshajayaneth/Tetris.git
cd Tetris
```

2. Start a simple server (Python built-in):

```powershell
python -m http.server 8000
# open http://localhost:8000 in your browser
```

Or with Node's `http-server`:

```powershell
npm install -g http-server
http-server -c-1
```

Recommended browsers: Chrome, Edge, Firefox (latest versions). Mobile: modern iOS/Android browsers.

---

## 🚀 Deploy to GitHub Pages
1. Push this repository to `github.com/<your-username>/Tetris`.
2. In the GitHub repository, go to Settings → Pages and set the source to the `main` branch (root).
3. Your site will be available at `https://<your-username>.github.io/Tetris`.

Pro tip: Add a `CNAME` if you use a custom domain.

---

## 🤝 Contribution & Feedback
Contributions are welcome! A short guide:

1. Fork the repo.
2. Create a feature branch: `git checkout -b feature/my-change`.
3. Commit your changes and push.
4. Open a pull request; include screenshots or a short video if you changed visuals.

Please file issues for bugs or feature requests. Label PRs with `enhancement` or `bug`.

---

## 🗺️ Roadmap
Planned improvements:
- [ ] Add background music and richer SFX (file-based audio assets).
- [ ] Add multi-next preview and hold animation.
- [ ] Server-side leaderboard option (optional integration).
- [ ] Theme presets (neon, retro, dark, high-contrast for accessibility).

If you'd like any of these prioritized, open an issue or request a PR.

---

## 🎨 Credits & Assets
- Developer: **Himesha Jayaneth**
- Font: Rubik (Google Fonts)
- Icons & Badges: shields.io
- Inspired by classic Tetris mechanics — SRS rotation implementation adapted for Canvas.

If you use external assets (images, sounds) be sure to credit the source in `assets/`.

---

## 📜 License
This project is released under the MIT License. See the `LICENSE` file for details.

---

## ✉️ Contact
Built by **Himesha Jayaneth** — [GitHub](https://github.com/himeshajayaneth) • [Live Demo](https://himeshajayaneth.github.io/Tetris)

If you publish this or add it to your portfolio, send a link — I'd love to see it!

---

## ❓ FAQ
Q: The game audio doesn't play on load — why?

A: Modern browsers require a user interaction (click/tap) before unlocking the WebAudio context. Click anywhere (Start button) or interact with the page to allow sounds.

Q: The canvas looks blurry on my display.

A: If you see blurriness on high-DPI displays, the canvas is scaled by CSS. You can increase the rendering resolution by adjusting the `CELL` scale in `tetris.js` or use devicePixelRatio adjustments.

Q: How do I change the control keys?

A: The key mappings are in `tetris.js` event listeners. You can change the bindings there or add a small settings UI to remap keys and persist them to `localStorage`.

---

## 🎨 Customization & Theming
Want a different vibe? Here are quick ways to theme the game:

- Colors: edit the `COLORS` object in `tetris.js`. Each key (I, J, L, O, S, T, Z) maps to a HEX color.

- UI: tweak `style.css` gradients, font sizes, and shadows to match your portfolio.

- Font: the project uses Google Fonts (`Rubik`). To change, update the `<link>` in `index.html` and any `font-family` references in `style.css`.

- Settings persistence: consider storing user theme and keybinds into `localStorage` so settings persist between visits.

Example: change the I-piece color in `tetris.js`:

```js
// current
const COLORS = { I: '#00f0f0', /* ... */ };
// update to neon pink
COLORS.I = '#FF4D9E';
```

---

## 🎞️ Create a demo GIF (recommended)
Record a short screen capture and convert it to an optimized GIF for the README. Example using `ffmpeg`:

```powershell
# export a short mp4 using your recorder then convert:
ffmpeg -i demo.mp4 -vf "scale=720:-1:flags=lanczos,fps=15" -loop 0 assets/demo.gif
```

For smaller size, try these options:

```powershell
ffmpeg -i demo.mp4 -vf "scale=640:-1:flags=lanczos,fps=12" -ss 00:00:01 -t 5 -loop 0 -lossless 0 assets/demo.gif
```

Upload `assets/demo.gif` and replace the hero image in the README for a highly engaging page.

---

## ♿ Accessibility Notes
- The UI uses clear high-contrast colors and large buttons for touch targets.
- Consider adding keyboard remapping and ARIA labels for the control buttons to improve accessibility.
- Add an options panel (font size, contrast mode) and persist settings to `localStorage`.

---

## 📝 Changelog (template)
Keep a short changelog in `CHANGELOG.md`. Example template:

```
# Changelog

## [Unreleased]
- Add feature: multiplayer spectating
- Fix: rotation edge-case on narrow boards

## [v1.0.0] - 2026-03-02
- Initial release: SRS rotation, hold, mobile controls, high score persistence
```

---

## 👥 Contributors
Thanks to everyone who helps improve the project. To add yourself to this section, open a PR and include a tiny bio + link.

Example contributor entry:
- **Your Name** — Short bio / role — [GitHub](https://github.com/yourname)

---

## ⚙️ Auto-deploy with GitHub Actions (optional)
You can automate GitHub Pages deployment using actions. Place a workflow like `.github/workflows/gh-pages.yml` that builds and deploys the repo on push to `main`.

A simple approach is to use the `peaceiris/actions-gh-pages` action. See the official docs to configure branch and token.

---

## 🔖 Badges & CI
- GitHub Pages: [Live Demo](https://himeshajayaneth.github.io/Tetris)
- CI / Deploy: ![Deploy](https://github.com/himeshajayaneth/Tetris/actions/workflows/gh-pages.yml/badge.svg)

---

## ⚠️ Known Issues
- Audio requires a user gesture in some browsers before WebAudio plays. This is a browser security policy, not a game bug.
- On very high-DPI screens the canvas may appear slightly blurred; increasing the `CELL` rendering scale or adding devicePixelRatio handling in `tetris.js` will improve sharpness.
- Complex rotation edge-cases can occur on extremely tight stacks; we're tracking refinements to the SRS handling in the roadmap.

---

## ⚡ Performance Tips
- Close background tabs and limit other heavy workloads while benchmarking frame-rate.
- Lower the `CELL` constant in `tetris.js` or throttle the draw rate if you need lighter CPU usage for low-end devices.
- Consider using `devicePixelRatio` to render crisp canvases on Retina displays (increase internal canvas size and scale down via CSS).

---

## 🙋 Getting Involved (quick tasks for contributors)
- Add a new theme variant (neon / retro / dark) and expose it in a small settings panel.
- Implement music (background loop) and add an in-game settings toggle to mute/unmute music independently from SFX.
- Add a 5-piece next-queue preview with a small scroll animation.
- Improve SRS edge-case handling and add more explicit unit tests for rotation logic.

If you'd like to pick one of these, create an issue and tag it `good-first-issue` or `enhancement`.

---

## 🏁 Showcase Suggestions (for GitHub Pages)
- Add `assets/demo.gif` (5-8s, looped) as the hero to catch visitors' eyes.
- Pin this repository on your GitHub profile and add the Live Demo link to your portfolio.
- Share the Live Demo on social media with a short clip — tag the repository so others can find it.

---

_Last updated: March 2, 2026_
