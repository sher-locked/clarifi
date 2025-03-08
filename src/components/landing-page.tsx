import { Clipboard, Link2, FileText, ImageIcon, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useRef } from 'react'
import Image from 'next/image'

interface LandingPageProps {
  attachedDocument?: string
  onAnalyze: () => void
  onFileSelect: (fileName: string) => void
}

export default function LandingPage({ attachedDocument: initialDocument, onAnalyze, onFileSelect }: LandingPageProps) {
  const [attachedDocument, setAttachedDocument] = useState<string>(initialDocument || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAttachedDocument(file.name)
      onFileSelect(file.name)
    }
  }

  const handleDocumentClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-gray-800">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          <span className="logo-text hover:neon-text transition-all duration-300">clarifi</span>
        </h1>
        <Button
          variant="ghost"
          className="text-white hover:text-white hover:bg-white/10 transition-colors duration-200"
        >
          Login <span className="ml-1">+</span>
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="mb-20 text-center flex items-center gap-4">
          <Image
            src="/globe.svg"
            alt="Globe icon"
            width={48}
            height={48}
            className="opacity-80"
          />
          <h2 className="text-6xl font-light text-white tracking-tight">
            see things as they are
          </h2>
        </div>

        <div className="w-full max-w-2xl">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 mb-4 border border-white/10">
            {attachedDocument ? (
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-white/70 mr-2" />
                <span className="text-white/90">{attachedDocument}</span>
              </div>
            ) : (
              <input
                type="text"
                placeholder="Paste any text here for a rational and unbiased analysis"
                className="w-full bg-transparent border-none outline-none text-white/90 placeholder-white/50"
              />
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex justify-start gap-3">
              <button className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-colors duration-200">
                <Clipboard className="h-5 w-5" />
              </button>
              <button className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-colors duration-200">
                <Link2 className="h-5 w-5" />
              </button>
              <button 
                className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-colors duration-200"
                onClick={handleDocumentClick}
                title="Upload document"
              >
                <FileText className="h-5 w-5" />
              </button>
              <button className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-colors duration-200">
                <ImageIcon className="h-5 w-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
            <Button
              onClick={onAnalyze}
              className="bg-white text-black hover:bg-white/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 text-sm font-medium"
              disabled={!attachedDocument}
            >
              Clarify <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="text-white/50 mt-12 text-center text-sm">
          Works great for articles, social media posts, or even your own texts.
        </p>
      </main>

      {/* Footer */}
      <footer className="p-6 flex justify-between items-center text-white/50">
        <Button variant="ghost" className="text-white/50 hover:text-white transition-colors duration-200 text-sm">
          Browse Examples <span className="ml-1">+</span>
        </Button>
        <p className="text-sm"> 2025 Clarifi.</p>
      </footer>
    </div>
  )
}
