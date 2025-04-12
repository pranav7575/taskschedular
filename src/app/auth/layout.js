export default function AuthLayout({ children }) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        {children}
      </div>
    );
  }