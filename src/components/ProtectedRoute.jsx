import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ user, requiredRole }) {
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const roles = user.roles || (user.role ? [user.role] : []);

    if (requiredRole && !roles.includes(requiredRole)) {
        // If they have volunteer role but are trying to access an area they don't have access to
        if (roles.includes('volunteer') && requiredRole === 'admin') {
            return <Navigate to="/" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
