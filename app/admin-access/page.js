import Link from 'next/link';

export default function AdminAccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <img
            className="h-12 w-auto mx-auto mb-6"
            src="https://res.cloudinary.com/dxcjrsrna/image/upload/raagsan/sepow/Raagsan-logo"
            alt="Raagsan"
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Access</h1>
          <p className="text-gray-600 mb-6">
            Access the admin portal to manage projects and stories.
          </p>
          <Link
            href="/admin"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold inline-block text-center"
          >
            Go to Admin Portal
          </Link>
          <div className="mt-6">
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
