import axios from 'axios';
import Cookies from 'js-cookie';
import {
  AuthUser,
  LoginRequest,
  RegisterRequest,
  PlayRequest,
  CreateRequestData,
  Participant,
  JoinRequestData,
  Rating,
  CreateRatingData,
  Notification,
  isLoggedInReqest,
  UpdateProfileRequest,
  UserResponse,
  IJoinedRequestsResponse,
  CompleteRating
} from './types';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authApi = {
  isLoggedIn: () =>
    api.get<isLoggedInReqest>('/islogin'),

  register: (data: RegisterRequest) =>
    api.post<AuthUser>('/register', data),

  login: (data: LoginRequest) =>
    api.post<AuthUser>('/login', data),

  logout: () => {
    Cookies.remove('token');
  },

  updateProfile: (data: UpdateProfileRequest) =>
    api.post<UpdateProfileRequest>('/profile/update', data),

};

// User API
export const userApi = {
  getProfile: (userId: number) =>
    api.get<UserResponse>(`/user/${userId}`),
};

// Play Request API
export const requestApi = {
  getAllRequests: () =>
    api.get<PlayRequest[]>('/requests'),

  getJoinedRequestsById: () =>
    api.get<IJoinedRequestsResponse>('/request/joined'),

  getRequestById: (requestId: number) =>
    api.get<PlayRequest>(`/request/${requestId}`),

  createRequest: (data: CreateRequestData) =>
    api.post<PlayRequest>('/request', data),

  deleteRequest: (requestId: number) =>
    api.delete(`/request/${requestId}`),

  // Participants
  getParticipants: (requestId: number) =>
    api.get<Participant[]>(`/request/${requestId}/participants`),

  joinRequest: (data: JoinRequestData) =>
    api.post<Participant>(`/request/${data.Request_id}/accept`, data),

  acceptParticipant: (requestId: number, participantId: number) => {
    console.log(participantId);

    return api.post(`/request/${requestId}/confirm`, { user_id: participantId })
  },

  rejectParticipant: (participantId: number) =>
    api.delete(`/participants/${participantId}`),

  confirmParticipants: (requestId: number) =>
    api.post(`/request/${requestId}/confirm`),
};

// Rating API
export const ratingApi = {
  submitRating: (data: CreateRatingData) =>
    api.post<Rating>('/ratings', data),

  getUserRatings: (userId: number) =>
    api.get<CompleteRating[]>(`/user/${userId}/ratings`),
};

// Notification API
export const notificationApi = {
  getNotifications: () =>
    api.get<Notification[]>('/notifications'),
};

export default api;