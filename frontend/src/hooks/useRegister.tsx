import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import { RegisterSchema } from '../schemas/auth';
import type { RegisterCredentials } from '../types/authTypes';
import { getErrorMessage } from '../utils/errorHandler';
import { toast } from 'react-toastify';

interface UseRegisterFormReturn {
    formData: RegisterCredentials;
    errors: Partial<Record<keyof RegisterCredentials, string>>;
    isLoading: boolean;
    showPassword: boolean;
    showConfirmPassword: boolean;
    agreedToTerms: boolean;
    setShowPassword: (show: boolean) => void;
    setShowConfirmPassword: (show: boolean) => void;
    setAgreedToTerms: (agreed: boolean) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
}

/**
 * Custom hook for registration form management
 */
export const useRegisterForm = (): UseRegisterFormReturn => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RegisterCredentials>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<Partial<Record<keyof RegisterCredentials, string>>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name as keyof RegisterCredentials]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    };

    const validateForm = (): boolean => {
        const result = RegisterSchema.safeParse(formData);
        if (result.success) {
            setErrors({});
            return true;
        }
        const fieldErrors: Partial<Record<keyof RegisterCredentials, string>> = {};
        result.error.issues.forEach(issue => {
            const fieldName = issue.path[0] as keyof RegisterCredentials;
            fieldErrors[fieldName] = issue.message;
        });
        setErrors(fieldErrors);
        return false;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        try {
            await register(formData);
            toast.success('Register successful!');
            navigate('/login');
        } catch (error) {
            const message = getErrorMessage(error);
            toast.error(message)
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        errors,
        isLoading,
        showPassword,
        showConfirmPassword,
        agreedToTerms,
        setShowPassword,
        setShowConfirmPassword,
        setAgreedToTerms,
        handleChange,
        handleSubmit,
    };
};
