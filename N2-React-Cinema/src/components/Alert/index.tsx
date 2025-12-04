import { useEffect, useState } from 'react';

interface AlertProps {
    message: string;
    type: 'success' | 'danger' | 'warning' | 'info';
    onClose?: () => void;
    autoClose?: boolean;
    duration?: number;
}

export const Alert = ({ message, type, onClose, autoClose = true, duration = 5000 }: AlertProps) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(() => {
                setVisible(false);
                onClose?.();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [autoClose, duration, onClose]);

    if (!visible) return null;

    return (
        <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
            {message}
            <button 
                type="button" 
                className="btn-close" 
                onClick={() => {
                    setVisible(false);
                    onClose?.();
                }}
            ></button>
        </div>
    );
};
