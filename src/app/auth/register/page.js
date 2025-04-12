import AuthForm from '../../../components/auth/AuthForm';

export default function RegisterPage() {
  return (
    <AuthForm
      title="Create an Account"
      subtitle="Get started with your task management"
      action="register"
      linkText="Already have an account? Log in"
      linkHref="/auth/login"
    />
  );
}