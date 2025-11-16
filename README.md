# Ornament Customizer for Laser Cutting

A simple web app to customize SVG ornaments for laser cutting. Built with Vite + React + Ant Design.

## Features

- **Top Arc Text**: Add curved text at the top of the ornament
- **Bottom Arc Text**: Add curved text at the bottom of the ornament
- **Center Images**: Choose from multiple center designs (Lake Tahoe, Heart, Star, or None)
- **Live Preview**: See your changes in real-time
- **Download SVG**: Export customized SVG files ready for laser cutting

## Getting Started

### Option 1: Docker (Recommended for Agor)

#### Using default port (5174):
```bash
docker-compose up
```

#### Using custom port:
```bash
PORT=8080 docker-compose up
```

Then open your browser to `http://localhost:5174` (or your custom port)

### Option 2: Local Development

```bash
npm install
npm run dev
```

Then open your browser to `http://localhost:5173`

## Docker Commands

```bash
# Start the app
docker-compose up

# Start with custom port
PORT=3000 docker-compose up

# Rebuild and start
docker-compose up --build

# Stop the app
docker-compose down

# Run in background
docker-compose up -d
```

## Environment Variables

- `PORT`: External port to expose (default: 5174)

## Adding Custom Center Images

Edit `src/App.jsx` and modify the `getCenterSvgContent()` function to add new SVG shapes:

```javascript
const getCenterSvgContent = () => {
  if (centerImage === 'your-new-image') {
    return `<path d="..." fill="none" stroke="#000000" stroke-width="2"/>`;
  }
  // ... other images
};
```

Then add the option to the Select dropdown in the form.

## Tech Stack

- **Vite**: Fast build tool and dev server
- **React**: UI library
- **Ant Design**: Component library for forms and layout
- **SVG Manipulation**: Native browser SVG DOM APIs

## License

MIT
