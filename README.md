# Phoenix Stories

Phoenix Stories is an AI-powered web application that transforms images into creative, engaging stories. By combining modern web technologies with artificial intelligence, the application delivers an immersive storytelling experience through an interactive 3D book interface.

---

## Overview

The application allows users to upload an image, which is analyzed using an AI model. Based on the visual content, the system generates a unique story presented inside a realistic page-flipping book with a responsive and modern user interface.

---

## Features

- AI-powered story generation from uploaded images.
- Image analysis using OpenRouter AI.
- Interactive 3D book with realistic page-flip animations.
- Responsive design for desktop, tablet, and mobile devices.
- Clean and modern dark-themed user interface.
- Fast and lightweight application built with Vite.

---

## Live Demo

https://phoenix-stories.vercel.app

---

## Technologies Used

- React 18
- Vite
- Tailwind CSS
- shadcn/ui
- Framer Motion
- OpenRouter AI (Gemini Flash)
- Base44 SDK

---

## Installation

Clone the repository:

```bash
git clone https://github.com/nada-etman/phoenix-stories.git
```

Navigate to the project directory:

```bash
cd phoenix-stories
```

Install the required dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

## Environment Variables

Create a `.env` file in the project root and add your OpenRouter API key:

```env
VITE_OPENROUTER_API_KEY=your_api_key_here
```

> Never commit your API keys to the repository.

---

## Project Structure

```
src/
│
├── api/             # API integration
├── assets/          # Images and static assets
├── components/      # Reusable UI components
├── pages/           # Application pages
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
├── App.jsx
└── main.jsx
```

---

## Technical Highlights

- Component-based architecture using React.
- Secure API key management through environment variables.
- Smooth animations powered by Framer Motion.
- Responsive layout optimized for multiple screen sizes.
- Clean, maintainable, and scalable code structure.
- AI integration through the OpenRouter API.

---

## Future Improvements

- User authentication.
- Story history and bookmarks.
- Multiple story styles and genres.
- Story export as PDF.
- Multi-language support.
- Voice narration using Text-to-Speech.

---

## License

This project was developed for educational and portfolio purposes.
