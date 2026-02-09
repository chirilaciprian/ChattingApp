import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import Loading from '../common/Loading';

type ProtectedRouteProps = {
    children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <Loading></Loading>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};