# Video Setup Guide for Live Feed

## Setting Up Video Files

To use the Live Feed feature with actual pig videos, follow these steps:

### 1. Create Videos Directory

Create a `videos` folder in the `public` directory:
```
livestock-monitoring/
  public/
    videos/
      barn-a.mp4
      barn-b.mp4
      outdoor.mp4
      isolation.mp4
```

### 2. Video File Names

The system expects these video files:
- `barn-a.mp4` - For Barn A - Main Area (camera1)
- `barn-b.mp4` - For Barn B - Feeding Area (camera2)
- `outdoor.mp4` - For Outdoor Pen (camera3)
- `isolation.mp4` - For Isolation Area (camera4)

### 3. Video Requirements

- **Format**: MP4 (H.264 codec recommended)
- **Resolution**: 1920x1080 (Full HD) or any standard resolution
- **Aspect Ratio**: 16:9 recommended
- **File Size**: Keep videos reasonable in size for web playback

### 4. Alternative: Using Webcam or RTSP Stream

If you want to use live camera feeds instead of video files, you can:

1. **Webcam**: Use `getUserMedia()` API
2. **RTSP Stream**: Convert RTSP to HLS or WebRTC
3. **IP Camera**: Use camera's HTTP stream URL

Update the `videoSrc` in `LiveFeed.tsx` to point to your stream URL.

### 5. Testing

1. Place your video files in `public/videos/`
2. Start the development server: `npm run dev`
3. Navigate to the Live Feed tab
4. Click "Start Stream"
5. Select different cameras to see different videos

### 6. YOLO Detection Overlay

The bounding boxes and labels are drawn on a canvas overlay. In production:
- Connect to your YOLO inference API
- Receive real-time detection data via WebSocket
- Update the `liveDetections` state with actual detection results

### Notes

- If video files don't exist, the component will show a placeholder
- Videos will loop automatically
- Detections update every 100ms (10 FPS) for smooth overlay
- Each camera has its own set of detections



