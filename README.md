# Plumberscape

Welcome to **Plumberscape** – a modern, full‑stack web application built for plumbing businesses to showcase their services, manage bookings, and connect with customers.

## Table of Contents

- [Project Overview](#project-overview)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [Project Structure](#project-structure)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Project Overview

Plumberscape is designed to help plumbing companies establish an online presence with a responsive, SEO‑friendly website. The platform includes:

- **Hero Section** with a compelling call‑to‑action
- **Services Section** detailing offered services
- **Project Gallery** showcasing past work
- **Testimonials Section** for client feedback
- **Contact Form** for lead generation
- **Admin Dashboard** (via the `theme-provider.tsx` component) for easy branding and configuration

The project follows modern React best practices, utilizes TypeScript, and is styled with Tailwind CSS for a polished, consistent UI.

---

## Demo

[Insert live demo URL here] – *(Replace with the actual URL when available)*

---

## Tech Stack

- **React 18** + **TypeScript**
- **Next.js** (App Router)
- **Tailwind CSS**
- **React Hook Form** & **Zod** for form validation
- **Node.js** (v18+) for server‑side logic
- **pnpm** as the package manager
- **Docker** (optional) for containerized development

---

## Getting Started

### Prerequisites

- **Node.js** (v18+)
- **pnpm** (v8+)
- **Git**
- (Optional) **Docker** and **Docker Compose**

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Codingvibes8/plumberscape.git
   cd plumberscape
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Build the project:

   ```bash
   pnpm build
   ```

### Environment Variables

Create a `.env.local` file in the project root with the following variables (example values):

```env
NEXT_PUBLIC_API_ENDPOINT=https://api.example.com
DATABASE_URL=your_database_connection_string
SECRET_KEY=your_secret_key
```

---

## Running the App

Start the development server:

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`. Open your browser to view the site.

To run tests:

```bash
pnpm test
```

To preview the production build:

```bash
pnpm start
```

---

## Project Structure

```
plumberscape/
├─ app/                # Next.js app directory (pages & layout)
│   ├─ layout.tsx
│   └─ page.tsx
├─ components/         # Reusable UI components
│   ├─ ContactForm.tsx
│   ├─ Footer.tsx
│   ├─ HeroSection.tsx
│   ├─ Navbar.tsx
│   ├─ ProjectGallery.tsx
│   ├─ ServicesSection.tsx
│   ├─ TestimonialsSection.tsx
│   └─ theme-provider.tsx
├─ components/ui/      # UI primitives (buttons, inputs, etc.)
├─ hooks/              # Custom hooks
│   ├─ use-mobile.ts
│   └─ use-toast.ts
├─ lib/                # Utility functions
│   └─ utils.ts
├─ public/             # Static assets (images, icons, etc.)
├─ styles/             # Global CSS and Tailwind configuration
│   └─ globals.css
├─ .next/              # Next.js build output (generated)
├─ .gitignore
├─ next.config.mjs
├─ package.json
├─ pnpm-lock.yaml
├─ postcss.config.mjs
├─ tsconfig.json
└─ README.md
```

---

## Features

- **Responsive Design** – Works on mobile, tablet, and desktop.
- **Dark Mode** – Toggleable theme via the `theme-provider.tsx`.
- **SEO Optimized** – Meta tags, Open Graph, and structured data.
- **Accessibility** – WCAG‑compliant components.
- **Easy Customization** – Theme variables and branding can be adjusted in one place.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m "Add YourFeature"`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

Please ensure your code passes linting (`pnpm lint`) and formatting checks (`pnpm format`). Run the test suite before submitting a PR.

---

## License

This project is licensed under the **MIT License** – see the `LICENSE` file for details.

---

## Contact

- **Author:** Codingvibes8
- **Email:** <codingvibes8@example.com>
- **GitHub:** [https://github.com/Codingvibes8/plumberscape](https://github.com/Codingvibes8/plumberscape)

Feel free to reach out with questions, feedback, or collaboration opportunities.
