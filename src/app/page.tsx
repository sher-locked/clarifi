"use client"

import { useState } from "react"
import LandingPage from "../components/landing-page"
import ReasoningClarityReport from "../components/reasoning-clarity-report"

export default function Home() {
  const [showReport, setShowReport] = useState(false)
  const [attachedDocument] = useState("YouTube Homepage Roadmap FY 25-26.pdf")

  return (
    <>
      {!showReport && <LandingPage attachedDocument={attachedDocument} onAnalyze={() => setShowReport(true)} />}
      {showReport && <ReasoningClarityReport onBack={() => setShowReport(false)} />}
    </>
  )
}

