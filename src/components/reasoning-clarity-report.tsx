"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Download, ArrowLeft } from "lucide-react"
import ConclusionCarousel from "./conclusion-carousel"

interface ReasoningClarityReportProps {
  onBack: () => void
}

const content = {
  title: "YouTube Roadmap '25-26",
  description:
    "This product roadmap for FY 2024–25 outlines our strategy to optimise the homepage experience, increase personalisation, and drive users toward more meaningful video engagement.",
  goal: "Communicate and gather feedback on the roadmap",
}

export default function ReasoningClarityReport({ onBack }: ReasoningClarityReportProps) {
  const [streamedDescription, setStreamedDescription] = useState("")
  const [streamedGoal, setStreamedGoal] = useState("")
  const [isStreamingDescription, setIsStreamingDescription] = useState(true)
  const [isStreamingGoal, setIsStreamingGoal] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let index = 0
    const streamInterval = setInterval(() => {
      if (index < content.description.length) {
        setStreamedDescription((prev) => prev + (content.description[index] || ""))
        index++
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
      } else {
        clearInterval(streamInterval)
        setIsStreamingDescription(false)
        setIsStreamingGoal(true)
      }
    }, 20) // Adjust speed as needed

    return () => clearInterval(streamInterval)
  }, [])

  useEffect(() => {
    if (isStreamingGoal) {
      let index = 0
      const streamInterval = setInterval(() => {
        if (index < content.goal.length) {
          setStreamedGoal((prev) => prev + (content.goal[index] || ""))
          index++
        } else {
          clearInterval(streamInterval)
          setIsStreamingGoal(false)
        }
      }, 20) // Adjust speed as needed

      return () => clearInterval(streamInterval)
    }
  }, [isStreamingGoal])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-gray-800">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center">
          <Button
            variant="ghost"
            className="mr-4 text-white hover:text-white hover:bg-white/10 transition-colors duration-200"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            <span className="logo-text hover:neon-text transition-all duration-300">clarifi</span>
          </h1>
        </div>
        <Button
          variant="ghost"
          className="text-white hover:text-white hover:bg-white/10 transition-colors duration-200"
        >
          Login <span className="ml-1">+</span>
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col px-6 py-8 overflow-hidden">
        {/* Document Overview Section */}
        <section
          ref={containerRef}
          className="mb-12 p-6 bg-white/5 backdrop-blur-sm rounded-lg border-2 border-white/20 shadow-lg overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-3xl font-semibold text-white">{content.title}</h2>
            <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-black">
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </div>
          <div className="mb-6">
            <p className="text-white/80">
              {streamedDescription}
              {isStreamingDescription && <span className="inline-block w-2 h-4 bg-white animate-blink ml-1"></span>}
            </p>
          </div>
          <div className="flex items-center">
            <span className="mr-2 text-2xl">🎯</span>
            <p className="font-semibold text-white">
              Goal: {streamedGoal}
              {isStreamingGoal && <span className="inline-block w-2 h-4 bg-white animate-blink ml-1"></span>}
            </p>
          </div>
        </section>

        {/* Conclusions Carousel Section */}
        {!isStreamingDescription && !isStreamingGoal && (
          <section>
            <h3 className="text-2xl font-semibold text-white mb-6">Key Conclusions</h3>
            <ConclusionCarousel />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="p-6 flex justify-between items-center text-white/50 mt-auto border-t border-white/10">
        <Button variant="ghost" className="text-white/50 hover:text-white transition-colors duration-200 text-sm">
          Browse Examples <span className="ml-1">+</span>
        </Button>
        <p className="text-sm">© 2025 Clarifi.</p>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        body {
          font-family: 'Inter', sans-serif;
        }

        .logo-text {
          color: #fff;
          text-shadow: 0 0 2px #fff,
                     0 0 4px #5271ff;
        }

        .neon-text {
          color: #fff;
          text-shadow: 0 0 7px #fff,
                     0 0 10px #fff,
                     0 0 21px #fff,
                     0 0 42px #5271ff,
                     0 0 82px #5271ff,
                     0 0 92px #5271ff,
                     0 0 102px #5271ff,
                     0 0 151px #5271ff;
        }

        @keyframes blink {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }

        .animate-blink {
          animation: blink 0.7s infinite;
        }
      `}</style>
    </div>
  )
}

