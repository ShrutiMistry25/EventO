import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { addUser, getUserByEmail } from '../utils/localStorage';
import type { UserRole } from '../types';
import { Building2, User, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer' as UserRole,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Check if email already exists
    const existingUser = getUserByEmail(formData.email);
    if (existingUser) {
      setErrors({ email: 'Email already registered' });
      setIsLoading(false);
      toast.error('Email already registered');
      return;
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      createdAt: new Date().toISOString(),
      isBlocked: false,
    };

    try {
      addUser(newUser);
      toast.success('Account created successfully!');
      
      // Redirect to login
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      toast.error('Failed to create account');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50 p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl">Create Account</CardTitle>
          <CardDescription>Join VenueBook and start booking or listing venues</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={errors.fullName ? 'border-red-500' : ''}
              />
              {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={errors.confirmPassword ? 'border-red-500' : ''}
              />
              {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <Label>Select Role</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
              >
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
                  <RadioGroupItem value="customer" id="customer" />
                  <Label htmlFor="customer" className="flex items-center gap-2 cursor-pointer flex-1">
                    <User className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium">Customer</div>
                      <div className="text-sm text-muted-foreground">Book and search venues</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-purple-50 cursor-pointer transition-colors">
                  <RadioGroupItem value="provider" id="provider" />
                  <Label htmlFor="provider" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    <div>
                      <div className="font-medium">Provider</div>
                      <div className="text-sm text-muted-foreground">List and manage venues</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-teal-50 cursor-pointer transition-colors opacity-60">
                  <RadioGroupItem value="admin" id="admin" disabled />
                  <Label htmlFor="admin" className="flex items-center gap-2 cursor-not-allowed flex-1">
                    <Shield className="w-5 h-5 text-teal-600" />
                    <div>
                      <div className="font-medium">Admin</div>
                      <div className="text-sm text-muted-foreground">Contact support for admin access</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            {/* Login Link */}
            <div className="text-center text-sm">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:underline font-medium"
              >
                Sign in
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
