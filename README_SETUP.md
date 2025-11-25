# Livestock Vision AI - Frontend Setup

This is the frontend React application for the Livestock Vision AI monitoring system. It connects to the FastAPI backend to provide image analysis and detection history.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- FastAPI backend running on `http://localhost:8000`

## Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Create environment file:**

Create a `.env` file in the root directory with the following content:

```env
VITE_API_URL=http://localhost:8000
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:5173` (or another port if 5173 is busy).

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
livestock-monitoring/
├── src/
│   ├── api/
│   │   └── livestock-api.ts        # API service for backend communication
│   ├── components/
│   │   ├── Dashboard.tsx           # Dashboard with system status
│   │   ├── ImageUpload.tsx         # Image upload and prediction
│   │   └── DetectionsList.tsx      # Detection history
│   ├── App.tsx                     # Main application component
│   ├── App.css                     # Custom styles
│   └── main.tsx                    # Application entry point
├── index.html                      # HTML template
└── package.json                    # Dependencies and scripts
```

## Features

### 1. Dashboard
- System health check
- Backend connection status
- Model information display
- Quick start guide

### 2. Image Analysis
- Upload images for livestock detection
- Real-time prediction with bounding boxes
- Confidence scores for each detection
- Visual feedback with annotated images

### 3. Detection History
- View all previous detections
- Sortable table with detailed information
- Delete detections
- Refresh data

## Usage

1. **Start the FastAPI Backend:**
   ```bash
   cd ../livestock-api/livestock-infer
   uvicorn app:app --reload
   ```

2. **Start the Frontend:**
   ```bash
   npm run dev
   ```

3. **Access the Application:**
   - Open your browser to `http://localhost:5173`
   - Navigate to the Dashboard to check backend connectivity
   - Go to Image Analysis to upload and analyze images
   - View Detection History to see all past detections

## API Integration

The frontend communicates with the FastAPI backend through these endpoints:

- `GET /health` - Check system health and model information
- `POST /predict/image` - Upload and analyze images
- `GET /detections` - Retrieve all detections
- `GET /detections/{id}` - Get specific detection
- `DELETE /detections/{id}` - Delete a detection

## Troubleshooting

### Backend Connection Failed

If you see "Backend Connection Failed" on the dashboard:

1. Make sure the FastAPI server is running:
   ```bash
   uvicorn app:app --reload
   ```

2. Verify the API URL in `.env` matches your backend:
   ```env
   VITE_API_URL=http://localhost:8000
   ```

3. Check for CORS issues in the backend configuration

### Image Upload Not Working

1. Ensure the backend is running and accessible
2. Check that the ONNX model is properly loaded
3. Verify the image format is supported (JPEG, PNG)
4. Check the browser console for detailed error messages

### Build Errors

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Check TypeScript errors:
   ```bash
   npm run lint
   ```

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Fetch API** - HTTP requests

## Development

### Adding New Features

1. Create new components in `src/components/`
2. Add new API methods in `src/api/livestock-api.ts`
3. Update the main `App.tsx` to include new routes/tabs

### Styling

The application uses Tailwind CSS for styling. Custom styles can be added to `src/App.css`.

## License

© 2024 Livestock Vision AI. All rights reserved.

