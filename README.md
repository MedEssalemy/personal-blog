# Essalemy — Personal Blog

A personal blog and portfolio by **Mohamed Es-salemy**, built with [Hugo](https://gohugo.io/) and the [PaperMod](https://github.com/adityatelange/hugo-PaperMod) theme, deployed on [Cloudflare Pages](https://pages.cloudflare.com/).

**Live site:** [7345562a.personal-blog-8ts.pages.dev](https://7345562a.personal-blog-8ts.pages.dev/)

---

## About

I'm a project management professional focused on automation and technical solutions. This blog covers:

- **Excel Automation** — advanced formulas, dynamic arrays, and complex templates
- **Project Management** — tools and techniques from real-world industrial environments
- **Process Optimization** — streamlining workflows and reducing manual effort
- **Technical Tutorials** — step-by-step guides with downloadable resources

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| [Hugo](https://gohugo.io/) | Static site generator |
| [PaperMod](https://github.com/adityatelange/hugo-PaperMod) | Theme (git submodule) |
| [Cloudflare Pages](https://pages.cloudflare.com/) | Hosting & CI/CD |

---

## Project Structure

```
personal-blog/
├── content/
│   ├── posts/          # Blog articles
│   ├── about.md        # About page
│   └── search.md       # Search page
├── assets/
│   └── images/         # Site images (processed by Hugo)
├── static/
│   └── images/         # Static images served as-is
├── layouts/
│   └── shortcodes/     # Custom Hugo shortcodes (e.g. youtube)
├── themes/
│   └── PaperMod/       # Theme (git submodule)
└── hugo.yaml           # Site configuration
```

---

## Local Development

### Prerequisites

- [Hugo Extended](https://gohugo.io/installation/) v0.112.0+
- Git

### Setup

```bash
# Clone the repo with submodules
git clone --recurse-submodules https://github.com/MedEssalemy/personal-blog.git
cd personal-blog

# Start local dev server
hugo server -D
```

The site will be available at `http://localhost:1313`.

### Build for production

```bash
hugo --gc --minify
```

Output is written to `public/`.

---

## Adding a New Post

```bash
hugo new content posts/my-new-post.md
```

Then edit `content/posts/my-new-post.md`. Set `draft: false` when ready to publish.

---

## Deployment

Cloudflare Pages automatically builds and deploys on every push to `master`.

| Setting | Value |
|---------|-------|
| Build command | `hugo --gc --minify` |
| Output directory | `public` |
| Root directory | `/` |

---

## Connect

- **LinkedIn:** [linkedin.com/in/essalemy](https://www.linkedin.com/in/essalemy/)
- **GitHub:** [github.com/MedEssalemy](https://github.com/MedEssalemy)
