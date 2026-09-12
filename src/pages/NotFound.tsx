import { Link } from 'react-router-dom'
import { ArrowLeft, FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[60vh] bg-bg-base">
      <div className="mb-8 pointer-events-none select-none text-tertiary opacity-50 hover:opacity-80 transition-opacity duration-500 ease-out animate-pulse">
        <FileQuestion size={120} strokeWidth={1} />
      </div>
      
      <h2 className="text-2xl font-black text-primary mb-4">
        Page Not Found
      </h2>
      
      <p className="text-secondary max-w-md mx-auto mb-10 text-sm leading-relaxed">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <Link
        to="/"
        className="flex items-center gap-2 px-6 py-3 bg-orange hover:bg-orange/90 text-white font-bold rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
      >
        <ArrowLeft size={18} />
        Back to Home
      </Link>
    </div>
  )
}
