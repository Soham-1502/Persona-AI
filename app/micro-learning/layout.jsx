import './micro-learning.css';
import CustomCursor from './CustomCursor';
import ProtectedRoute from '@/app/components/shared/provider/ProtectedRoute';

export default function MicroLearningLayout({ children }) {
    return (
        <ProtectedRoute>
            <CustomCursor />
            {children}
        </ProtectedRoute>
    );
}
