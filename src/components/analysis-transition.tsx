"use client"

import { useEffect, useState } from "react"

interface AnalysisTransitionProps {
  onComplete: () => void
}

export default function AnalysisTransition({ onComplete }: AnalysisTransitionProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval)
          onComplete()
          return 100
        }
        return prevProgress + 2 // Faster progress
      })
    }, 20) // Slightly faster updates

    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-gray-800 z-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl px-6">
        <div className="relative overflow-hidden">
          <div className="mb-8 flex items-center justify-center gap-4">
            <div className="h-8 w-8 rounded bg-white/10 animate-pulse"></div>
            <div className="h-12 w-64 rounded bg-white/10 animate-pulse"></div>
          </div>
          
          <div className="space-y-4">
            <div className="h-12 w-full rounded bg-white/5 relative overflow-hidden">
              <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </div>
            
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 w-10 rounded bg-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ animationDelay: `${i * 150}ms` }}></div>
                </div>
              ))}
              <div className="flex-grow"></div>
              <div className="h-10 w-24 rounded bg-white/5 relative overflow-hidden">
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ animationDelay: "750ms" }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center">
          <div className="w-full max-w-md bg-white/5 rounded-full h-1 mb-4 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-white/50 text-sm">Analyzing document...</p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  )
}
