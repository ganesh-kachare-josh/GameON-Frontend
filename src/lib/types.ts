// User types
export interface UserResponse {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    sports: Record<string, string>;
    created_at?: string;
}

export interface AuthUser extends UserResponse {
    token?: string;
}

export interface isLoggedInReqest {
    is_login: boolean,
    user_id: null | number
}
// Authentication types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    phone_number: string;
    sports: Record<string, string>;
}

export interface UpdateProfileRequest {
    name: string;
    email: string;
    phone_number: string;
    sports: Record<string, string>;
}

export interface UpdateProfileResponse {
    name: string;
    email: string;
    phone_number: string;
    sports: Record<string, string>;
}

// Sport level options
export type SportLevel = "Basic" | "Intermediate" | "Advanced";

// Request types
export interface PlayRequest {
    id: number;
    user_id: number;

    //creator details
    name: string;
    email: string;
    phone_number: string;


    sport: Record<string, string>;
    location: string;
    time: string;
    court_price: number;
    status: 'Open' | 'Accepted' | 'Cancelled' | 'Completed';
    created_at: string;
}

export interface IJoinedRequestsResponse {
    joined_requests: number[];
}

export interface CreateRequestData {
    user_id: number;
    sport: Record<string, string>;
    location: string;
    time: string;
    court_price: number;
}

// Participant types
export interface Participant {
    id: number;
    request_id: number;
    user_id: number;
    name: string,
    status: 'Pending' | 'Confirmed' | 'Cancelled';
}

export interface JoinRequestData {
    User_id: number;
    Request_id: number;
}

// Rating types
export interface Rating {
    id: number;
    given_by: number;
    given_to: number;
    request_id: number;
    rating: 1 | 2 | 3 | 4 | 5;
    feedback?: string;
    created_at: string;
}

export interface CompleteRating {
    id: number;
    given_by: number;
    name: string, //give by user name
    given_to: number;
    request_id: number;
    sport: Record<string, string>; // format {gameName: level} :  e.g {tennis: basic}
    rating: 1 | 2 | 3 | 4 | 5;
    feedback?: string;
    created_at: string;
}

export interface CreateRatingData {
    given_by: number;
    given_to: number;
    request_id: number;
    rating: 1 | 2 | 3 | 4 | 5;
    feedback?: string;
}

// Notification types
export interface Notification {
    id: number;
    message: string;
    type: 'Success' | 'Warning' | 'Reminder';
}