// components/PublicRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import Loading from '../common/Loading';

type PublicRouteProps = {
    children: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
        return <Loading></Loading>;
    }
    if (isAuthenticated) {
        return <Navigate to="/chat" replace />;
    }
    return <>{children}</>;
};