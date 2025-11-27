
---

# ✅ **README for Frontend**  
(For: `pig-monitoring-frontend`)


# 🐖 Cloud AI Livestock Security & Monitoring System — Frontend  
React • Redux/Context • Maps • YOLO Overlays • AWS • Analytics Dashboard

This is the frontend interface for a cloud-based livestock monitoring and security system.  
It gives farmers real-time insights into animal behavior, health, movement, and possible theft alerts.

---

## 🎯 Key Features

### 📊 Analytics Dashboard
- Shows total livestock, alerts, temperature charts, behaviors, and daily summaries.

### 🐖 Behavior Detection UI
- Real-time YOLO overlays (standing, walking, lying, sleeping)
- Displays behavior percentages and anomaly indicators

### 🗺 Live GPS Tracking
- Shows animal locations on a map  
- Geofencing with out-of-bounds alerts  
- Pin-based location visualization

### 🧬 Individual Animal Insights
- Health readings (temperature, posture, movement)
- Behavior history graphs
- Last-seen GPS location

### 🖼 Model Testing Tab
- Upload an image  
- Backend returns YOLO results  
- Predictions drawn directly on the image  

---

## 🛠 Tech Stack

- **React (Vite or CRA)**
- **TailwindCSS / CSS**
- **Axios**
- **Leaflet.js or Google Maps**
- **Chart.js / Recharts**
- **AWS S3 (for media)**
- **FastAPI backend**

---

## 📂 Folder Structure
- src/
- ├── components/
- │ ├── Header.jsx
- │ ├── Sidebar.jsx
- │ ├── AnalyticsCard.jsx
- │ └── BehaviorOverlay.jsx
- ├── pages/
- │ ├── Dashboard.jsx
- │ ├── Behavior.jsx
- │ ├── MapView.jsx
- │ ├── AnimalDetails.jsx
- │ └── TestModel.jsx
- ├── utils/
- │ └── api.js
- └── App.jsx


```sh

---

## ⚙ Installation

### Clone Repo
```sh
git clone https://github.com/madzyy/pig-monitoring-frontend.git
cd pig-monitoring-frontend
```

##Install Dependencies
```sh
npm install
```

##Start Development Server
```sh
npm run dev
```

##🔗 API Configuration

#Edit src/utils/api.js:
```sh
export const API_URL = "http://localhost:8000";
```

##🧪 How the Model Test Page Works

- User uploads an image

- Image sent to backend FastAPI /predict

- Backend returns YOLO bounding boxes + labels

- Overlay drawn on the canvas

- Confidence and behavior displayed
