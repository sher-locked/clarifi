"use client"

import { useState } from "react"
import LandingPage from "../components/landing-page"
import ReasoningClarityReport from "../components/reasoning-clarity-report"
import AnalysisTransition from "../components/analysis-transition"

export default function Home() {
  const [showReport, setShowReport] = useState(false)
  const [attachedDocument, setAttachedDocument] = useState<string>("")
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleAnalyze = () => {
    setIsTransitioning(true)
  }

  const handleTransitionComplete = () => {
    setIsTransitioning(false)
    setShowReport(true)
  }

  return (
    <>
      {!showReport && !isTransitioning && (
        <LandingPage 
          attachedDocument={attachedDocument} 
          onAnalyze={handleAnalyze}
          onFileSelect={setAttachedDocument}
        />
      )}
      {isTransitioning && (
        <AnalysisTransition onComplete={handleTransitionComplete} />
      )}
      {showReport && (
        <ReasoningClarityReport onBack={() => setShowReport(false)} />
      )}
    </>
  )
}
