"use client"

import { Carousel, CarouselItem } from "@/components/ui/carousel"
import { Lightbulb } from "lucide-react"
import Conclusion from "./conclusion"

const conclusions = [
  {
    number: 1,
    title: "Personalising Content with Greater Granularity",
    subText:
      "Enhanced user controls for customising their feed (pinning interests, filtering out topics) and advanced recommendation algorithms tailored to user's micro-preferences and context.",
    reasons: [
      {
        tag: "Good",
        text: "Increased user engagement",
        summary: "Personalized content leads to higher user satisfaction and time spent on the platform.",
        evidences: [
          { quality: "high", text: "A/B test results show 20% increase in watch time" },
          { quality: "medium", text: "User survey indicates 85% preference for personalized feeds" },
        ],
        fallacies: [{ severity: "low", text: "Possible confirmation bias in user surveys" }],
      },
      {
        tag: "Ok",
        text: "Technical complexity",
        summary: "Implementing granular personalization requires significant backend changes.",
        evidences: [
          { quality: "medium", text: "Engineering team estimates 6-month development time" },
          { quality: "low", text: "Similar features in competitor products took 8-12 months to implement" },
        ],
        fallacies: [{ severity: "medium", text: "Optimism bias in development time estimates" }],
      },
    ],
    watchOut: ["Potential for creating echo chambers", "Data privacy concerns with increased personalization"],
    actionPoints: [
      "Conduct user research on desired granularity levels",
      "Develop privacy-preserving personalization techniques",
    ],
  },
  {
    number: 2,
    title: "Enhancing Video Discovery Algorithms",
    subText:
      "Implement advanced machine learning models to improve video recommendations and increase user engagement.",
    reasons: [
      {
        tag: "Good",
        text: "Improved user satisfaction",
        summary: "Better recommendations lead to users finding content they enjoy more quickly.",
        evidences: [
          { quality: "high", text: "User feedback shows 30% increase in satisfaction with recommendations" },
          { quality: "medium", text: "Click-through rate on recommended videos increased by 15%" },
        ],
        fallacies: [{ severity: "low", text: "Survivorship bias in user feedback" }],
      },
      {
        tag: "Ok",
        text: "Resource intensive",
        summary: "Developing and maintaining advanced ML models requires significant computational resources.",
        evidences: [
          { quality: "medium", text: "Initial cost estimates show 20% increase in infrastructure spending" },
          { quality: "low", text: "Similar projects in the industry took 12-18 months to fully implement" },
        ],
        fallacies: [{ severity: "medium", text: "Underestimating the complexity of ML model deployment" }],
      },
    ],
    watchOut: ["Balancing exploration vs exploitation in recommendations", "Ensuring diversity in recommended content"],
    actionPoints: [
      "Invest in ML infrastructure and talent",
      "Develop metrics to measure recommendation quality beyond engagement",
    ],
  },
  {
    number: 3,
    title: "Redesigning User Interface for Better Accessibility",
    subText:
      "Overhaul the homepage UI to improve accessibility and usability across different devices and user groups.",
    reasons: [
      {
        tag: "Good",
        text: "Increased inclusivity",
        summary: "A more accessible design allows a wider range of users to enjoy the platform.",
        evidences: [
          { quality: "high", text: "Accessibility audit shows 40% improvement in WCAG compliance" },
          { quality: "medium", text: "User testing with diverse groups shows positive feedback" },
        ],
        fallacies: [{ severity: "low", text: "Assuming all accessibility improvements will be equally impactful" }],
      },
      {
        tag: "Ok",
        text: "Potential user adjustment period",
        summary: "Significant UI changes may require time for users to adapt.",
        evidences: [
          { quality: "medium", text: "Previous major UI changes led to a temporary 5% dip in user engagement" },
          { quality: "low", text: "Social media sentiment analysis shows mixed reactions to redesign announcements" },
        ],
        fallacies: [{ severity: "medium", text: "Overestimating users' resistance to change" }],
      },
    ],
    watchOut: [
      "Balancing new design with familiarity for existing users",
      "Ensuring performance isn't compromised by new UI elements",
    ],
    actionPoints: [
      "Conduct extensive user testing with diverse user groups",
      "Develop a phased rollout plan with easy opt-out options",
    ],
  },
  {
    number: 4,
    title: "Implementing Real-time Content Trending",
    subText:
      "Develop a system to identify and promote trending content in near real-time, improving content discovery and user engagement.",
    reasons: [
      {
        tag: "Good",
        text: "Increased content freshness",
        summary: "Real-time trending helps users discover new, relevant content quickly.",
        evidences: [
          { quality: "high", text: "Platforms with real-time trending features show 25% higher user retention" },
          { quality: "medium", text: "Survey indicates 70% of users are interested in trending content" },
        ],
        fallacies: [{ severity: "low", text: "Assuming all trending content is high-quality or relevant" }],
      },
      {
        tag: "Ok",
        text: "Potential for manipulation",
        summary: "Real-time systems can be vulnerable to coordinated attempts to game the algorithm.",
        evidences: [
          { quality: "medium", text: "Other platforms have faced issues with trend manipulation" },
          { quality: "low", text: "Internal simulations show potential vulnerabilities in proposed system" },
        ],
        fallacies: [{ severity: "medium", text: "Underestimating the resourcefulness of bad actors" }],
      },
    ],
    watchOut: ["Ensuring trend detection doesn't amplify misinformation", "Balancing global vs. personalized trends"],
    actionPoints: [
      "Develop robust safeguards against trend manipulation",
      "Create a content moderation strategy for trending items",
    ],
  },
]

export default function ConclusionCarousel() {
  return (
    <div className="w-full">
      {/* Helper Text */}
      <div className="flex items-center gap-2 text-white/70 mb-4">
        <Lightbulb className="h-5 w-5" />
        <p className="text-sm">Swipe or use arrows to see all the conclusions of the document</p>
      </div>

      <Carousel>
        {conclusions.map((conclusion) => (
          <CarouselItem key={conclusion.number}>
            <Conclusion {...conclusion} />
          </CarouselItem>
        ))}
      </Carousel>
    </div>
  )
}

