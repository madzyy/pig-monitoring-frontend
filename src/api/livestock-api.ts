// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// API Response Types
export interface Detection {
  id: string;
  filename: string;
  confidence: number;
  bbox: number[]; // [x, y, width, height]
  class_id: number; // 0=lying, 1=sleeping, 2=investigating, 3=eating, 4=walking, 5=mounted
  timestamp: string;
}

export interface PredictionResponse {
  filename: string;
  detections: Detection[];
}

export interface HealthResponse {
  status: string;
  model: string;
  input: {
    name: string;
    shape: number[];
  };
  outputs: Array<{
    name: string;
    shape: (number | string)[];
  }>;
}

// API Service Class
class LivestockAPI {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  // Health check
  async checkHealth(): Promise<HealthResponse> {
    const response = await fetch(`${this.baseURL}/health`);
    if (!response.ok) {
      throw new Error('Health check failed');
    }
    return response.json();
  }

  // Predict image
  async predictImage(file: File): Promise<PredictionResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseURL}/predict/image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Prediction failed: ${error}`);
    }

    return response.json();
  }

  // Get all detections
  async getAllDetections(): Promise<Detection[]> {
    const response = await fetch(`${this.baseURL}/detections`);
    if (!response.ok) {
      throw new Error('Failed to fetch detections');
    }
    return response.json();
  }

  // Get single detection
  async getDetection(id: string): Promise<Detection> {
    const response = await fetch(`${this.baseURL}/detections/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch detection');
    }
    return response.json();
  }

  // Delete detection
  async deleteDetection(id: string): Promise<{ deleted: string }> {
    const response = await fetch(`${this.baseURL}/detections/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete detection');
    }
    return response.json();
  }
}

// Export singleton instance
export const livestockAPI = new LivestockAPI();

