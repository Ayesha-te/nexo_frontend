import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import PinRequest from "./pages/PinRequest";
import MyPins from "./pages/MyPins";
import AddUser from "./pages/AddUser";
import MyTree from "./pages/MyTree";
import WithdrawHistory from "./pages/WithdrawHistory";
import ChangePassword from "./pages/ChangePassword";
import ProfileSettings from "./pages/ProfileSettings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagePinRequests from "./pages/admin/ManagePinRequests";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageWithdrawals from "./pages/admin/ManageWithdrawals";
import ManageComplaintsAndFeedback from "./pages/admin/ManageComplaintsAndFeedback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
  const { isLoggedIn, isAdmin } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;
  if (!adminOnly && isAdmin) return <Navigate to="/admin/dashboard" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isLoggedIn, isAdmin } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isLoggedIn ? <Navigate to={isAdmin ? "/admin/dashboard" : "/dashboard"} replace /> : <LoginPage />} />
      <Route path="/" element={<Navigate to={isLoggedIn ? (isAdmin ? "/admin/dashboard" : "/dashboard") : "/login"} replace />} />

      {/* User Routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/pin-request" element={<ProtectedRoute><PinRequest /></ProtectedRoute>} />
      <Route path="/my-pins" element={<ProtectedRoute><MyPins /></ProtectedRoute>} />
      <Route path="/add-user" element={<ProtectedRoute><AddUser /></ProtectedRoute>} />
      <Route path="/my-tree" element={<ProtectedRoute><MyTree /></ProtectedRoute>} />
      <Route path="/withdraw-history" element={<ProtectedRoute><WithdrawHistory /></ProtectedRoute>} />
      <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/pin-requests" element={<ProtectedRoute adminOnly><ManagePinRequests /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute adminOnly><ManageUsers /></ProtectedRoute>} />
      <Route path="/admin/withdrawals" element={<ProtectedRoute adminOnly><ManageWithdrawals /></ProtectedRoute>} />
      <Route path="/admin/complaints" element={<ProtectedRoute adminOnly><ManageComplaintsAndFeedback /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
