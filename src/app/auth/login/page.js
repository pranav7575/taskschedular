import AuthForm from '../../../components/auth/AuthForm';

export default function LoginPage() {
  return (
    <AuthForm
      title="Welcome Back"
      subtitle="Log in to your account to continue"
      action="login"
      linkText="Don't have an account? Sign up"
      linkHref="/auth/register"
    />
  );
}