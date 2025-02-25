import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AlertTriangle, CheckCircle, XCircle, Info, ArrowRight } from "lucide-react"

const tagColors = {
  Good: "bg-green-500/20 text-green-300",
  Ok: "bg-yellow-500/20 text-yellow-300",
  Bad: "bg-red-500/20 text-red-300",
}

const evidenceIcons = {
  high: <CheckCircle className="h-4 w-4 text-green-400" />,
  medium: <Info className="h-4 w-4 text-yellow-400" />,
  low: <XCircle className="h-4 w-4 text-red-400" />,
}

const fallacyIcons = {
  high: <AlertTriangle className="h-4 w-4 text-red-400" />,
  medium: <AlertTriangle className="h-4 w-4 text-yellow-400" />,
  low: <AlertTriangle className="h-4 w-4 text-green-400" />,
}

export default function Conclusion({ number, title, subText, reasons, watchOut, actionPoints }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-2 text-white">
        {number}. {title}
      </h2>
      <p className="text-white/80 mb-4">{subText}</p>

      <Accordion type="single" collapsible className="mb-4">
        {reasons.map((reason, index) => (
          <AccordionItem value={`item-${index}`} key={index} className="border-white/20">
            <AccordionTrigger className="text-white hover:text-white/80">
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mr-2 ${tagColors[reason.tag]}`}
              >
                {reason.tag}
              </span>
              {reason.text}
            </AccordionTrigger>
            <AccordionContent className="text-white/80">
              <div className="pl-4 border-l-2 border-white/20">
                <h4 className="font-semibold mb-2">Reason Summary</h4>
                <p className="mb-4">{reason.summary}</p>

                <h4 className="font-semibold mb-2">Evidences</h4>
                <ul className="mb-4">
                  {reason.evidences.map((evidence, i) => (
                    <li key={i} className="flex items-center mb-1">
                      {evidenceIcons[evidence.quality]}
                      <span className="ml-2">{evidence.text}</span>
                    </li>
                  ))}
                </ul>

                <h4 className="font-semibold mb-2">Fallacies</h4>
                <ul>
                  {reason.fallacies.map((fallacy, i) => (
                    <li key={i} className="flex items-center mb-1">
                      {fallacyIcons[fallacy.severity]}
                      <span className="ml-2">{fallacy.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mb-4">
        <h3 className="font-semibold flex items-center mb-2 text-white">
          <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" /> Watch Out
        </h3>
        <ul className="list-disc pl-5 text-white/80">
          {watchOut.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold flex items-center mb-2 text-white">
          <ArrowRight className="h-5 w-5 mr-2 text-blue-400" /> Action Points
        </h3>
        <ul className="list-disc pl-5 text-white/80">
          {actionPoints.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

