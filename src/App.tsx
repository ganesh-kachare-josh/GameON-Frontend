import { createBrowserRouter, RouterProvider } from "react-router";
import DashboardPage from "./pages/DashboardPage";
import CreateRequestPage from "./pages/CreateRequestPage";
import RequestDetailsPage from "./pages/RequestDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import "./App.css";
import { Layout } from "./components/layout/Layout";
import LoginPage from "./pages/LoginPage";
import { RegisterForm } from "./components/auth/RegisterForm";
import HomePage from "./pages/HomePage";
import { ProtectedRoute } from "./components/special/ProtectedRoute";
import EditProfilePage from "./pages/EditProfilePage";
import PublicProfilePage from "./pages/PublicProfilePage";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterForm /> },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        )
      },
      {
        path: "/create-request",
        element: (
          <ProtectedRoute>
            <CreateRequestPage />
          </ProtectedRoute>
        )
      },
      {
        path: "/request/:id",
        element: (
          <ProtectedRoute>
            <RequestDetailsPage />
          </ProtectedRoute>
        )
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        )
      },
      {
        path: "/public/profile/:userId",
        element: (
          <ProtectedRoute>
            <PublicProfilePage />
          </ProtectedRoute>
        )
      },
      {
        path: "/profile/edit",
        element: (
          <ProtectedRoute>
            <EditProfilePage />
          </ProtectedRoute>
        )
      },
    ]
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
