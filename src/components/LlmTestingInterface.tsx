'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useStreamingResponse } from '@/hooks/useStreamingResponse';
import { availableModels, getModelInfo } from '@/lib/constants/modelInfo';
import { estimateTokens } from '@/lib/utils/tokenCalculation';
import { formatNumber } from '@/lib/utils/formatters';

// Import extracted components
import { ThinkingIndicator } from '@/components/LlmTesting/ThinkingIndicator';
import { StreamingDisplay } from '@/components/LlmTesting/StreamingDisplay';
import { ModelSelector } from '@/components/LlmTesting/ModelSelector';

const DEFAULT_PRODUCT_PROMPT = `# Communication Enhancement Analyzer

**Role**:  
"You're an expert editor. Analyze the user's text below and provide structured feedback in JSON format using this framework:"

### **User Input**  
"[PASTE USER'S TEXT HERE]"  

---

### **Output Format**  
Return a valid JSON object with the following structure:

\`\`\`json
{
  "summaryDashboard": {
    "storytellingRating": "Strong|Good|Weak",
    "reasoningRating": "Strong|Good|Weak",
    "priorityFocus": "string"
  },
  "storytellingAnalysis": {
    "setup": {
      "content": "string",
      "rating": "Great|Good|Weak",
      "feedback": "string"
    },
    "conflict": {
      "content": "string",
      "rating": "Great|Good|Weak",
      "feedback": "string"
    },
    "resolution": {
      "content": "string",
      "rating": "Great|Good|Weak",
      "feedback": "string"
    },
    "overallRating": "Great|Good|Weak",
    "topSuggestion": "string"
  },
  "reasoningAnalysis": {
    "premise": {
      "content": "string",
      "rating": "Great|Good|Weak",
      "feedback": "string"
    },
    "evidence": {
      "content": "string",
      "rating": "Great|Good|Weak",
      "feedback": "string"
    },
    "conclusion": {
      "content": "string",
      "rating": "Great|Good|Weak",
      "feedback": "string"
    },
    "overallRating": "Great|Good|Weak",
    "topSuggestion": "string"
  },
  "notes": {
    "grammarErrors": ["string"],
    "biases": ["string"],
    "jargonComplexity": ["string"]
  },
  "suggestedImprovements": ["string", "string", "string"]
}
\`\`\`

**Rules**:  
- Return valid, properly formatted JSON
- Start with strengths
- Link feedback to specific text quotes
- For Weak ratings, provide concrete examples`;

export function LlmTestingInterface() {
  // State for form inputs
  const [userPrompt, setUserPrompt] = useState('');
  const [productPrompt, setProductPrompt] = useState(DEFAULT_PRODUCT_PROMPT);
  const [selectedModel, setSelectedModel] = useState(availableModels[0]?.value || 'gpt-4');
  const [startTime, setStartTime] = useState(Date.now());
  const [estimatedTokensForInput, setEstimatedTokensForInput] = useState(0);
  
  // Get selected model info
  const modelInfo = getModelInfo(selectedModel);
  
  // Streaming state from custom hook
  const {
    content,
    isLoading,
    error,
    stage,
    reset: resetStream,
    startStreaming,
    usageData,
    responseData
  } = useStreamingResponse({
    onComplete: () => {
      // Completion callback if needed
    }
  });

  // Generate the combined prompt (product prompt + user input)
  const combinedPrompt = productPrompt.replace('[PASTE USER\'S TEXT HERE]', userPrompt);
  
  // Update token estimation when inputs change
  useEffect(() => {
    const estimatedTokenCount = estimateTokens(combinedPrompt);
    setEstimatedTokensForInput(estimatedTokenCount);
  }, [userPrompt, productPrompt, combinedPrompt]);
  
  // Add state for API key errors
  const [apiKeyError, setApiKeyError] = useState<{providers: string[], models: string[]} | null>(null);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStartTime(Date.now());
    resetStream();
    // Reset API key error
    setApiKeyError(null);
    
    try {
      // Start the streaming process
      const response = await startStreaming('/api/llm-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: userPrompt,
          selectedModels: [selectedModel],
          streaming: true,
          systemMessage: productPrompt
        })
      });
      
      // Check if response contains API key error
      if (response && response.status === 401) {
        try {
          const errorData = await response.clone().json();
          if (errorData.missingProviders) {
            setApiKeyError({
              providers: errorData.missingProviders,
              models: selectedModel ? [selectedModel] : []
            });
          }
        } catch (jsonErr) {
          console.error('Error parsing error response:', jsonErr);
        }
      }
    } catch (err) {
      console.error('Error submitting request:', err);
    }
  };
  
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Communication Enhancement Analyzer</h1>
      </div>
      
      <Tabs defaultValue="user-mode" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="user-mode">User Mode</TabsTrigger>
          <TabsTrigger value="dev-mode">Dev Mode</TabsTrigger>
        </TabsList>
        
        {/* User Mode - Focused on usability and user experience */}
        <TabsContent value="user-mode" className="space-y-6">
          {/* Input form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardContent className="pt-6 space-y-6">
                {/* Hero User Prompt input */}
                <div className="space-y-2">
                  <Label htmlFor="user-prompt" className="text-lg font-medium">Enter Your Text</Label>
                  <Textarea
                    id="user-prompt"
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    className="h-60 text-base"
                    placeholder="Paste your text here for feedback and analysis..."
                    disabled={isLoading}
                  />
                  
                  {/* Token estimation */}
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Estimated tokens: {formatNumber(estimatedTokensForInput)}</span>
                    {modelInfo && (
                      <span className={estimatedTokensForInput > modelInfo.tokenLimit ? 'text-red-500 font-medium' : ''}>
                        Max input tokens: {formatNumber(modelInfo.tokenLimit)}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Model selector */}
                <ModelSelector 
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  disabled={isLoading}
                />
                
                {/* Submit button */}
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isLoading || !userPrompt.trim()}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? 'Analyzing...' : 'Analyze Text'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
          
          {/* Results section */}
          {(isLoading || content) && (
            <div className="space-y-4">
              {/* Thinking/streaming indicator */}
              <ThinkingIndicator 
                stage={stage} 
                model={selectedModel} 
                startTime={startTime}
                usageData={usageData}
                modelInfo={modelInfo}
              />
              
              {/* Streaming display - with user mode */}
              <StreamingDisplay 
                content={content}
                model={selectedModel}
                response={responseData}
                usageData={usageData}
                modelInfo={modelInfo}
                mode="user"
              />
            </div>
          )}
          
          {/* Error display */}
          {error && (
            <Card className="border-red-300 dark:border-red-800">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Error</h3>
                <p className="text-sm">{error}</p>
              </CardContent>
            </Card>
          )}
          
          {apiKeyError && (
            <Card className="border-amber-300 dark:border-amber-800">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium text-amber-600 dark:text-amber-400 mb-2">API Key Missing</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Missing API key for {apiKeyError.providers.join(' and ')}.</strong> Unable to use model{apiKeyError.models.length > 1 ? 's' : ''}: {apiKeyError.models.join(', ')}.
                  </p>
                  <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded text-sm">
                    <p className="font-medium mb-1">To fix this issue:</p>
                    <ol className="list-decimal pl-5 space-y-1">
                      <li>Create an API key from the provider's website.</li>
                      <li>Add it to your .env.local file.</li>
                      <li>Restart the application.</li>
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Dev Mode - Focused on technical details and development information */}
        <TabsContent value="dev-mode" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left column - Input and Request details */}
            <div className="space-y-6">
              {/* Final combined prompt (read-only) */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="text-lg font-medium">Final Prompt</h3>
                  <div className="space-y-2">
                    <Label htmlFor="final-prompt">Complete prompt sent to the LLM:</Label>
                    <Textarea
                      id="final-prompt"
                      value={combinedPrompt}
                      className="h-60 font-mono text-sm"
                      readOnly
                    />
                    
                    {/* Token estimation */}
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Estimated tokens: {formatNumber(estimatedTokensForInput)}</span>
                      {modelInfo && (
                        <span className={estimatedTokensForInput > modelInfo.tokenLimit ? 'text-red-500 font-medium' : ''}>
                          Max input tokens: {formatNumber(modelInfo.tokenLimit)}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Product Prompt (editable) */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="text-lg font-medium">System Prompt</h3>
                  <div className="space-y-2">
                    <Label htmlFor="product-prompt">Edit the system instructions:</Label>
                    <Textarea
                      id="product-prompt"
                      value={productPrompt}
                      onChange={(e) => setProductPrompt(e.target.value)}
                      className="h-60 text-sm font-mono"
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Request Details */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="text-lg font-medium">API Request Details</h3>
                  <pre className="text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded overflow-auto max-h-[200px]">
                    {JSON.stringify({
                      endpoint: '/api/llm-test',
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: {
                        prompt: userPrompt ? '(user text)' : '',
                        selectedModels: [selectedModel],
                        streaming: true,
                        systemMessage: '(system prompt)'
                      }
                    }, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </div>
            
            {/* Right column - Response and Analysis */}
            <div className="space-y-6">
              {/* User input for testing */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="text-lg font-medium">Test Input</h3>
                  <div className="space-y-2">
                    <Label htmlFor="dev-user-prompt">Enter text to analyze:</Label>
                    <Textarea
                      id="dev-user-prompt"
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      className="h-40 text-sm"
                      placeholder="Paste your text here for testing..."
                      disabled={isLoading}
                    />
                  </div>
                  
                  {/* Model selector */}
                  <ModelSelector 
                    selectedModel={selectedModel}
                    onModelChange={setSelectedModel}
                    disabled={isLoading}
                  />
                  
                  {/* Submit button */}
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSubmit} 
                      disabled={isLoading || !userPrompt.trim()}
                      className="w-full sm:w-auto"
                    >
                      {isLoading ? 'Analyzing...' : 'Test Now'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Response data */}
              {(isLoading || content) && (
                <div className="space-y-4">
                  {/* Thinking/streaming indicator */}
                  <ThinkingIndicator 
                    stage={stage} 
                    model={selectedModel} 
                    startTime={startTime}
                    usageData={usageData}
                    modelInfo={modelInfo}
                  />
                  
                  {/* Raw response data */}
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <h3 className="text-lg font-medium">API Response</h3>
                      <pre className="text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded overflow-auto max-h-[300px]">
                        {content ? content : "Waiting for response..."}
                      </pre>
                    </CardContent>
                  </Card>
                  
                  {/* Response metadata */}
                  {responseData && (
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        <h3 className="text-lg font-medium">Response Metadata</h3>
                        <pre className="text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded overflow-auto max-h-[200px]">
                          {JSON.stringify(responseData, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  )}
                  
                  {/* Usage data */}
                  {usageData && (
                    <Card>
                      <CardContent className="pt-6 space-y-4">
                        <h3 className="text-lg font-medium">Usage Data</h3>
                        <pre className="text-xs bg-slate-50 dark:bg-slate-900 p-3 rounded overflow-auto max-h-[200px]">
                          {JSON.stringify(usageData, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
              
              {/* Error display */}
              {error && (
                <Card className="border-red-300 dark:border-red-800">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Error</h3>
                    <pre className="text-xs bg-red-50 dark:bg-red-900/30 p-3 rounded overflow-auto">
                      {error}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 