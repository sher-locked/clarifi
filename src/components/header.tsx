import { Printer, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 rounded-b-3xl shadow-lg">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-light tracking-wider">clarifi</h1>
          <div className="space-x-2">
            <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-gray-800">
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-gray-800">
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </div>
        </div>
        <h2 className="text-3xl font-semibold mb-2">YouTube Homepage Roadmap</h2>
        <p className="text-lg mb-4">
          This product roadmap for FY 2024–25 outlines our strategy to optimise the homepage experience, increase
          personalisation, and drive users toward more meaningful video engagement.
        </p>
        <div className="flex items-center">
          <span className="mr-2">🎯</span>
          <p className="font-semibold">Goal: Communicate and gather feedback on the roadmap.</p>
        </div>
      </div>
    </header>
  )
}

