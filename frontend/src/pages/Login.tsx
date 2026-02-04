import { Link } from 'react-router-dom';
import LoginHero from '../components/authHeroSections/LoginHero';
import { HiEnvelope, HiLockClosed, HiEye, HiChatBubbleBottomCenter, HiArrowRight } from 'react-icons/hi2';
import { useLogin } from '../hooks/useLogin';
import { FcGoogle } from 'react-icons/fc';

const handleGoogleLogin = () => {  
  console.log('Google login initiated');
  // TODO: Integrate with Google OAuth library (e.g., @react-oauth/google)
};

const Login = () => {
  const {
    formData,
    errors,
    isLoading,
    showPassword,
    setShowPassword,
    handleChange,
    handleSubmit,
  } = useLogin();

  return (
    <div className="min-h-screen flex">
      <LoginHero />
      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-base-100">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <HiChatBubbleBottomCenter className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-bold mb-2">Welcome Back</h2>
            <p className="text-base-content/60">
              Please enter your credentials to sign in
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  placeholder="Enter your password"
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
                  <HiEye className="w-5 h-5 text-base-content/40" />
                </button>
              </div>
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.password}</span>
                </label>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="label cursor-pointer gap-2">
                <input type="checkbox" className="checkbox checkbox-sm checkbox-primary" />
                <span className="label-text">Remember me</span>
              </label>
              <a href="#" className="text-sm link link-primary no-underline hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`btn btn-primary w-full text-base h-12 ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
              {!isLoading && <HiArrowRight className="w-5 h-5 ml-2" />}
            </button>
          </form>

          {/* Social Login */}
          <div className="divider my-8">OR CONTINUE WITH</div>

          <div className="grid grid-cols-1 gap-4">
            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="btn bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 flex items-center justify-center gap-3 h-12"
            >
              <FcGoogle className="w-5 h-5" />
              <span className="font-medium">Continue with Google</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <p className="text-base-content/60">
              Don't have an account?{' '}
              <Link to="/register" className="link link-primary font-semibold no-underline hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
