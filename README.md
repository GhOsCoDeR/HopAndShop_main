# TechStore - Modern E-commerce Website

A modern e-commerce website built with Next.js, TypeScript, and Tailwind CSS. This project showcases a Best Buy-like experience with features such as product browsing, shopping cart, checkout process, and more.

## Features

- 🛍️ Product browsing with filtering and sorting
- 🛒 Shopping cart with persistent state
- 💳 Multi-step checkout process
- 🎨 Modern and responsive design
- ⚡ Fast page loads with Next.js
- 🎭 Smooth animations with Framer Motion
- 📱 Mobile-first approach
- 🔍 Search functionality
- 📦 Category-based navigation
- ⭐ Product ratings and reviews

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Heroicons
- **Development Tools**: ESLint, TypeScript

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/techstore.git
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── checkout/          # Checkout pages
│   ├── products/          # Product pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── checkout/         # Checkout components
│   ├── ProductCard.tsx   # Product card component
│   ├── Navigation.tsx    # Navigation component
│   └── Footer.tsx        # Footer component
├── store/                # State management
│   └── cartStore.ts      # Shopping cart store
└── styles/              # Global styles
    └── globals.css      # Global CSS
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Zustand](https://github.com/pmndrs/zustand) 