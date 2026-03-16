import { useNavigate } from "react-router-dom";

export default function AccessMessagePage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-safari-forest-800 via-safari-green-700 to-safari-brown-600 overflow-hidden">
      {/* Floating gradient orbs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-safari-gold-400/20 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-safari-green-400/20 blur-3xl rounded-full" />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-safari-brown-400/30 blur-2xl rounded-full" />

      <div className="relative max-w-md w-full bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-10 text-center space-y-6">
        {/* Icon with pulse glow */}
        <div className="mx-auto w-24 h-24 relative">
          <div className="absolute inset-0 bg-safari-gold-300/40 rounded-full blur-md animate-pulse" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 w-full h-full text-white drop-shadow-lg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M12 20.5a8.5 8.5 0 100-17 8.5 8.5 0 000 17z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white tracking-wide font-playfair">
          Something Went Wrong
        </h1>

        {/* Subtitle */}
        <p className="text-white/80 leading-relaxed font-lato">
          The page you’re trying to access isn’t available right now. <br />
          Please check your access or return to the home page.
        </p>

        {/* Return Button */}
        <button
          onClick={() => navigate("/")}
          className="group relative overflow-hidden px-6 py-3 rounded-lg font-medium bg-safari-gold-400 text-safari-forest-900 shadow-lg hover:shadow-safari-gold-300/50 transition-all duration-300 hover:-translate-y-1"
        >
          <span className="relative z-10 flex items-center justify-center">
            <svg
              className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Go Back Home
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-safari-green-500 to-safari-brown-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        {/* Footer note */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-white/50">
            Need help? Contact our team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
