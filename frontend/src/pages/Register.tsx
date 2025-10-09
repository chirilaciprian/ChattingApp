import { Link } from 'react-router-dom';
import {
    HiArrowRight,
    HiUser,
    HiEnvelope,
    HiLockClosed,
    HiEye,
    HiCheckCircle,
    HiChatBubbleBottomCenter,
} from 'react-icons/hi2';
import RegisterHero from '../components/authHeroSections/RegisterHero';
import { useRegisterForm } from '../hooks/useRegisterForm';

const Register = () => {
    const {
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
    } = useRegisterForm();

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Registration Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-base-100">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                        <div className="lg:hidden flex justify-center mb-8">
                            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center">
                                <HiChatBubbleBottomCenter className="w-8 h-8 text-white" />
                            </div>
                        </div>

                    <div className="mb-10">
                        <h2 className="text-4xl font-bold mb-2">Create Account</h2>
                        <p className="text-base-content/60">
                            Join thousands of users already chatting
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Username</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <HiUser className="w-5 h-5 text-base-content/40" />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="JohnDoe"
                                    className={`input input-bordered w-full pl-10 ${errors.username ? 'input-error' : ''}`}
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {errors.username && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.username}</span>
                                </label>
                            )}
                        </div>

                        {/* Email Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Email Address</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <HiEnvelope className="w-5 h-5 text-base-content/40" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    className={`input input-bordered w-full pl-10 ${errors.email ? 'input-error' : ''}`}
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {errors.email && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.email}</span>
                                </label>
                            )}
                        </div>

                        {/* Password Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Password</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <HiLockClosed className="w-5 h-5 text-base-content/40" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Create a strong password"
                                    className={`input input-bordered w-full pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <HiEye className="w-5 h-5 text-base-content/40" />
                                    ) : (
                                        <HiEye className="w-5 h-5 text-base-content/40" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.password}</span>
                                </label>
                            )}
                        </div>

                        {/* Confirm Password Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">Confirm Password</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <HiCheckCircle className="w-5 h-5 text-base-content/40" />
                                </div>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    placeholder="Re-enter your password"
                                    className={`input input-bordered w-full pl-10 pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <HiEye className="w-5 h-5 text-base-content/40" />
                                    ) : (
                                        <HiEye className="w-5 h-5 text-base-content/40" />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{errors.confirmPassword}</span>
                                </label>
                            )}
                        </div>

                        {/* Terms and Conditions */}
                        <div className="form-control">
                            <label className="label cursor-pointer justify-start gap-2">
                                <input 
                                    type="checkbox" 
                                    className="checkbox checkbox-sm checkbox-primary" 
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                />
                                <span className="label-text">
                                    I agree to the{' '}
                                    <a href="#" className="link link-primary no-underline hover:underline">
                                        Terms and Conditions
                                    </a>
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            className={`btn btn-primary w-full text-base h-12 ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                            {!isLoading && <HiArrowRight />}
                        </button>
                    </form>
                    
                    <div className="text-center mt-8">
                        <p className="text-base-content/60">
                            Already have an account?{' '}
                            <Link to="/login" className="link link-primary font-semibold no-underline hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <RegisterHero />
            
        </div>
    );
};

export default Register;
