import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  Message,
  Course,
  Location,
  CourseSearchParams,
  ApiResponse,
} from "../types";

class ApiService {
  private api: AxiosInstance;

  constructor(
    baseURL: string = process.env.REACT_APP_API_URL ||
      "https://oeichatbotrag-production.up.railway.app"
  ) {
    this.api = axios.create({
      baseURL,
      timeout: 60000, // OPTIMIZATION: Increased from 30s to 60s
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor for logging
    this.api.interceptors.request.use(
      (config) => {
        console.log(
          `API Request: ${config.method?.toUpperCase()} ${config.url}`
        );
        return config;
      },
      (error) => {
        console.error("API Request Error:", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error(
          "API Response Error:",
          error.response?.data || error.message
        );
        return Promise.reject(error);
      }
    );
  }

  // Chat endpoints
  async sendMessage(
    message: string,
    chatHistory: Message[] = []
  ): Promise<
    ApiResponse<{ message: string; courses?: Course[]; ai_content?: string }>
  > {
    try {
      const response: AxiosResponse<
        ApiResponse<{
          message: string;
          courses?: Course[];
          ai_content?: string;
        }>
      > = await this.api.post("/chat/message", {
        message,
        chat_history: chatHistory.map((msg) => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp.toISOString(),
        })),
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to send message: ${error}`);
    }
  }

  // Course endpoints
  async searchCourses(
    params: CourseSearchParams
  ): Promise<ApiResponse<Course[]>> {
    try {
      const response: AxiosResponse<ApiResponse<Course[]>> =
        await this.api.post("/courses/search", params);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to search courses: ${error}`);
    }
  }

  async getCourseDetail(
    courseId: number,
    locationId?: number
  ): Promise<ApiResponse<Course>> {
    try {
      const response: AxiosResponse<ApiResponse<Course>> = await this.api.get(
        `/courses/${courseId}`,
        {
          params: { location_id: locationId },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get course detail: ${error}`);
    }
  }

  async getLocations(): Promise<ApiResponse<Location[]>> {
    try {
      const response: AxiosResponse<ApiResponse<Location[]>> =
        await this.api.get("/courses/locations");
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get locations: ${error}`);
    }
  }

  async getPlacementTests(locationId?: number): Promise<ApiResponse<any[]>> {
    try {
      const response: AxiosResponse<ApiResponse<any[]>> = await this.api.get(
        "/courses/placement-tests",
        {
          params: { location_id: locationId },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get placement tests: ${error}`);
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.api.get("/health");
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

// Create singleton instance
export const apiService = new ApiService();

export default ApiService;
