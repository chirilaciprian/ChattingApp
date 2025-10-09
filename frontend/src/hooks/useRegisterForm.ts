import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register as registerService } from '../services/authService';
import { RegisterSchema } from '../schemas/auth';
import type { ZodError } from 'zod';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface UseRegisterFormReturn {
  formData: RegisterFormData;
  errors: Partial<Record<keyof RegisterFormData, string>>;
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
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof RegisterFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validate = (): boolean => {
    try {
      RegisterSchema.parse(formData);
      if (!agreedToTerms) {
        // Show a general error by attaching to email field
        setErrors({});
        alert('Please agree to the Terms and Conditions');
        return false;
      }
      setErrors({});
      return true;
    } catch (err) {
      const zErr = err as ZodError;
      const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};
      zErr.issues.forEach((e) => {
        const path = e.path[0] as keyof RegisterFormData | undefined;
        if (path) newErrors[path] = e.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await registerService({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      
      if (response.success && response.token) {
        // Store token in localStorage (in real app, use httpOnly cookies)
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Navigate to chat
        navigate('/chat');
      } else {
        setErrors({ email: response.error || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ email: 'An error occurred. Please try again.' });
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
