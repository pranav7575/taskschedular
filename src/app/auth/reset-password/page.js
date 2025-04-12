import AuthForm from '../../../components/auth/AuthForm';

export default function ResetPasswordPage() {
  return (
    <AuthForm
      title="Reset Password"
      subtitle="Enter your email to reset your password"
      action="reset"
      linkText="Remember your password? Log in"
      linkHref="/login"
    />
  );
}