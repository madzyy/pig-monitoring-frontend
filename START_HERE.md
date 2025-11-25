# 🚀 Quick Start Guide - Livestock Vision AI

## Step-by-Step Instructions

### 1. Create Environment File

Create a file named `.env` in this directory (`livestock-monitoring`) with:

```env
VITE_API_URL=http://localhost:8000
```

### 2. Start the Backend API

Open a **new terminal** and run:

```bash
cd C:\Users\Jojo\Desktop\livestock-api\livestock-infer
uvicorn app:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
Loading ONNX model from: models/best.onnx
Model loaded successfully!
```

### 3. Start the Frontend

In **another terminal**, run:

```bash
cd C:\Users\Jojo\Desktop\livestock-monitoring
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 4. Open the Application

Open your browser and go to: **http://localhost:5173**

## 🎯 Testing the Application

1. **Check Dashboard**
   - The dashboard should show "Status: ok" with green checkmark
   - If you see an error, make sure the backend is running

2. **Upload an Image**
   - Click on "📷 Image Analysis" tab
   - Click "Upload Image" and select a livestock image
   - Click "Analyze Image"
   - You should see bounding boxes around detected animals

3. **View History**
   - Click on "📋 History" tab
   - See all previous detections
   - Delete detections if needed

## ⚠️ Troubleshooting

### "Backend Connection Failed"
- ✅ Make sure backend is running on port 8000
- ✅ Check that `.env` file exists with correct API URL
- ✅ Restart both backend and frontend

### "Internal Server Error" on Image Upload
- ✅ Check backend terminal for error messages
- ✅ Verify ONNX model is loaded correctly
- ✅ Try a different image format (JPG or PNG)

### Port Already in Use
- **Frontend (5173):** Vite will automatically use next available port
- **Backend (8000):** Kill existing process or change port

## 📁 Directory Structure

```
livestock-monitoring/          ← Frontend (React + TypeScript)
├── src/
│   ├── api/                  ← API service
│   ├── components/           ← React components
│   ├── App.tsx              ← Main app
│   └── main.tsx             ← Entry point
├── .env                     ← Configuration (create this!)
└── package.json

livestock-api/livestock-infer/ ← Backend (FastAPI + ONNX)
├── app.py                   ← Main API (with CORS enabled)
├── models/best.onnx         ← YOLO model
├── database.py              ← Database logic
└── config.py                ← Configuration
```

## 🎨 Features

✨ **Dashboard** - System health and model info
✨ **Image Analysis** - Upload and detect livestock
✨ **Detection History** - View and manage detections
✨ **Real-time Feedback** - Bounding boxes with confidence scores
✨ **Responsive Design** - Works on desktop and tablet

## 🔧 Technologies Used

**Frontend:**
- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)

**Backend:**
- FastAPI (Python)
- ONNX Runtime (AI inference)
- MySQL/SQLite (database)

## 📞 Need Help?

Check the detailed README_SETUP.md file for more information!

