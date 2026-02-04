import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext"
import { useState, type ChangeEvent } from "react";
import type { LoginCredentials } from "../types/authTypes";
import { LoginSchema } from "../schemas/auth";
import { toast } from "react-toastify";
import { getErrorMessage } from "../utils/errorHandler";

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof LoginCredentials, string>>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof LoginCredentials]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }

  const validateForm = (): boolean => {
    const result = LoginSchema.safeParse(formData);
    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors: Partial<Record<keyof LoginCredentials, string>> = {};

    result.error.issues.forEach(issue => {
      const fieldName = issue.path[0] as keyof LoginCredentials;
      fieldErrors[fieldName] = issue.message;
    });
    setErrors(fieldErrors);
    return false;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      await login(formData);
      toast.success('Login successful!');
      navigate('/chat');
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, showPassword, setShowPassword, formData, setFormData, handleChange, handleSubmit, errors };
}