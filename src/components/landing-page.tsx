import { Clipboard, Link2, FileText, ImageIcon, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LandingPageProps {
  attachedDocument?: string
  onAnalyze: () => void
}

export default function LandingPage({ attachedDocument, onAnalyze }: LandingPageProps) {
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
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-20">
        <div className="flex items-center gap-4 mb-12">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-YaEMgkOGyL2hBJHx4ayccz9EGFm4AY.png"
            alt=""
            className="w-12 h-12"
          />
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white tracking-tight">
            see things as they are
          </h2>
        </div>

        <div className="w-full max-w-3xl">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 mb-2 border border-white/10">
            {attachedDocument ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-white/70 mr-2" />
                  <span className="text-white/90">{attachedDocument}</span>
                </div>
                <Button
                  onClick={onAnalyze}
                  className="bg-white text-black hover:bg-white/90 transition-colors duration-200"
                >
                  Clarify <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <input
                type="text"
                placeholder="Paste any text here for a rational and unbiased analysis"
                className="w-full bg-transparent border-none outline-none text-white placeholder-white/50"
              />
            )}
          </div>

          <div className="flex justify-start gap-4 px-2">
            <button className="p-2 text-white/50 hover:text-white transition-colors duration-200">
              <Clipboard className="h-5 w-5" />
            </button>
            <button className="p-2 text-white/50 hover:text-white transition-colors duration-200">
              <Link2 className="h-5 w-5" />
            </button>
            <button className="p-2 text-white/50 hover:text-white transition-colors duration-200">
              <FileText className="h-5 w-5" />
            </button>
            <button className="p-2 text-white/50 hover:text-white transition-colors duration-200">
              <ImageIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <p className="text-white/50 mt-6 text-center">
          Works great for articles, social media posts, or even your own texts.
        </p>
      </main>

      {/* Footer */}
      <footer className="p-6 flex justify-between items-center text-white/50">
        <Button variant="ghost" className="text-white/50 hover:text-white transition-colors duration-200 text-sm">
          Browse Examples <span className="ml-1">+</span>
        </Button>
        <p className="text-sm">© 2025 Clarifi.</p>
      </footer>
    </div>
  )
}

