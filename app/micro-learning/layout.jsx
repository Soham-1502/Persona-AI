import './micro-learning.css';
import CustomCursor from './CustomCursor';

export default function MicroLearningLayout({ children }) {
    return (
        <>
            <CustomCursor />
            {children}
        </>
    );
}
