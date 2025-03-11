import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatNumber } from '@/lib/utils/formatters';
import { ModelInfo } from '@/lib/constants/modelInfo';
import { UsageData, CostData } from '@/lib/utils/tokenCalculation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// New RatingIndicator component for better visual representation
function RatingIndicator({ 
  rating,
  size = 'md',
  className
}: { 
  rating: string | undefined; 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  if (!rating) return null;
  
  const lowerRating = rating.toLowerCase();
  
  // Determine style based on rating
  let bgColor = '';
  let textColor = '';
  let icon = '';
  let label = rating;
  
  switch (lowerRating) {
    case 'strong':
    case 'great':
      bgColor = 'bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700';
      textColor = 'text-white';
      icon = '★★★';
      break;
    case 'good':
      bgColor = 'bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600';
      textColor = 'text-gray-800 dark:text-gray-100';
      icon = '★★';
      break;
    case 'weak':
      bgColor = 'bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700';
      textColor = 'text-white';
      icon = '★';
      break;
    default:
      bgColor = 'bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800';
      textColor = 'text-gray-700 dark:text-gray-200';
      icon = '';
  }

  // Size classes
  const sizeClasses = {
    sm: 'text-xs py-1 px-2',
    md: 'text-sm py-1.5 px-3',
    lg: 'text-base py-2 px-4'
  };
  
  return (
    <div 
      className={cn(
        'rounded-md shadow-sm font-medium flex items-center justify-center',
        bgColor,
        textColor,
        sizeClasses[size],
        className
      )}
    >
      <span className="mr-1.5">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

// Simple inline Badge component to avoid import issues
function Badge({ 
  children, 
  variant = 'outline', 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: 'outline' | 'default' | 'success' | 'warning' | 'error' }) {
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variant === 'outline' ? "border border-input bg-background" : "",
        variant === 'default' ? "bg-primary text-primary-foreground" : "",
        variant === 'success' ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "",
        variant === 'warning' ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" : "",
        variant === 'error' ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" : "",
        className
      )} 
      {...props}
    >
      {children}
    </span>
  );
}

type StreamingDisplayProps = {
  content: string;
  model: string;
  response: Record<string, unknown> | null;
  usageData: UsageData | null;
  modelInfo: ModelInfo | null;
  mode?: 'user' | 'dev'; // New prop to determine display mode
};

export function StreamingDisplay({ 
  content, 
  model, 
  response, 
  usageData,
  modelInfo,
  mode = 'dev' // Default to dev mode for backward compatibility
}: StreamingDisplayProps) {
  const jsonDisplayRef = useRef<HTMLDivElement>(null);
  const prettyDisplayRef = useRef<HTMLDivElement>(null);
  const [tokenDetails, setTokenDetails] = useState<{ inputTokens: number; outputTokens: number; totalTokens: number }>({
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0
  });
  const [usdCostData, setUsdCostData] = useState<CostData | null>(null);
  const [inrCostData, setInrCostData] = useState<CostData | null>(null);
  const [displayMode, setDisplayMode] = useState<'json' | 'pretty'>('pretty');
  const [parsedContent, setParsedContent] = useState<Record<string, any> | null>(null);
    
  // Update token information when usage data changes
  useEffect(() => {
    if (usageData) {
      setTokenDetails({
        inputTokens: usageData.prompt_tokens || 0,
        outputTokens: usageData.completion_tokens || 0,
        totalTokens: usageData.total_tokens || 0
      });
      
      // Set cost data from usageData
      setUsdCostData(usageData.cost_usd || null);
      setInrCostData(usageData.cost_inr || null);
    }
  }, [usageData]);

  // Try to parse the content as JSON for pretty display
  useEffect(() => {
    if (content) {
      try {
        // Only attempt to parse if content looks like JSON
        if (content.trim().startsWith('{') || content.trim().startsWith('[')) {
          const parsed = JSON.parse(content);
          setParsedContent(parsed);
        }
      } catch (error) {
        // If parsing fails, don't update parsedContent
        // This allows partial JSON to be displayed in the raw view
        // while waiting for the complete JSON to be received
      }
    } else {
      setParsedContent(null);
    }
  }, [content]);

  // Auto-scroll to bottom as content updates
  useEffect(() => {
    if (displayMode === 'json' && jsonDisplayRef.current) {
      jsonDisplayRef.current.scrollTop = jsonDisplayRef.current.scrollHeight;
    } else if (displayMode === 'pretty' && prettyDisplayRef.current) {
      prettyDisplayRef.current.scrollTop = prettyDisplayRef.current.scrollHeight;
    }
  }, [content, displayMode]);
  
  // Get appropriate badge variant based on rating
  const getRatingBadgeVariant = (rating?: string): 'success' | 'warning' | 'error' | 'outline' => {
    if (!rating) return 'outline';
    switch (rating.toLowerCase()) {
      case 'strong':
      case 'great':
        return 'success';
      case 'good':
        return 'warning';
      case 'weak':
        return 'error';
      default:
        return 'outline';
    }
  };

  // Render a visually enhanced analysis section
  const renderAnalysisSection = (title: string, analysisData: any) => {
    if (!analysisData) return null;
    
    const overallRating = analysisData.overallRating;
    
    return (
      <div className="mb-6 border rounded-lg p-4 bg-white dark:bg-slate-950 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
          <h3 className="text-lg font-bold">{title}</h3>
          {overallRating && (
            <RatingIndicator rating={overallRating} size="md" />
          )}
        </div>
        
        {Object.entries(analysisData).map(([key, value]) => {
          // Skip rendering overallRating and topSuggestion as they're handled specially
          if (key === 'overallRating' || key === 'topSuggestion') return null;
          
          // Handle nested objects (like setup, conflict, resolution, etc.)
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            const nestedValue = value as any;
            
            return (
              <div key={key} className="mb-4 border-t pt-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                  <h4 className="font-medium capitalize">{key}</h4>
                  {nestedValue.rating && (
                    <RatingIndicator rating={nestedValue.rating} size="sm" />
                  )}
                </div>
                {nestedValue.content && (
                  <div className="mb-2 text-slate-700 dark:text-slate-300 text-sm">
                    {nestedValue.content}
                  </div>
                )}
                {nestedValue.feedback && (
                  <div className="text-xs italic bg-slate-50 dark:bg-slate-900 p-2 rounded">
                    {nestedValue.feedback}
                  </div>
                )}
              </div>
            );
          }
          
          return null;
        })}
        
        {analysisData.topSuggestion && (
          <div className="mt-4 bg-blue-50 dark:bg-blue-950 p-3 rounded-md text-sm">
            <span className="font-medium">Top suggestion: </span>
            {analysisData.topSuggestion}
          </div>
        )}
      </div>
    );
  };

  // Render the dashboard summary
  const renderSummaryDashboard = (summaryData: any) => {
    if (!summaryData) return null;
    
    return (
      <div className="mb-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg p-4 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Summary Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-950 p-4 rounded-md shadow-sm">
            <div className="text-sm text-slate-500 mb-2">Storytelling</div>
            <div className="flex items-center">
              <RatingIndicator 
                rating={summaryData.storytellingRating} 
                size="lg"
                className="w-full justify-center"
              />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-950 p-4 rounded-md shadow-sm">
            <div className="text-sm text-slate-500 mb-2">Reasoning</div>
            <div className="flex items-center">
              <RatingIndicator 
                rating={summaryData.reasoningRating} 
                size="lg"
                className="w-full justify-center"
              />
            </div>
          </div>
          <div className="bg-white dark:bg-slate-950 p-4 rounded-md shadow-sm">
            <div className="text-sm text-slate-500 mb-2">Priority Focus</div>
            <div className="text-sm font-medium p-2 bg-blue-50 dark:bg-blue-900 dark:text-blue-50 rounded-md">
              {summaryData.priorityFocus || 'None specified'}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render notes section with better formatting
  const renderNotes = (notes: any) => {
    if (!notes) return null;
    
    return (
      <div className="mb-6 border rounded-lg p-4 bg-white dark:bg-slate-950 shadow-sm">
        <h3 className="text-lg font-bold mb-3">Notes</h3>
        
        {notes.grammarErrors && notes.grammarErrors.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Grammar Issues</h4>
            <ul className="list-disc pl-5 text-sm">
              {notes.grammarErrors.map((error: string, index: number) => (
                <li key={`grammar-${index}`} className="mb-1">{error}</li>
              ))}
            </ul>
          </div>
        )}
        
        {notes.biases && notes.biases.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Potential Biases</h4>
            <ul className="list-disc pl-5 text-sm">
              {notes.biases.map((bias: string, index: number) => (
                <li key={`bias-${index}`} className="mb-1">{bias}</li>
              ))}
            </ul>
          </div>
        )}
        
        {notes.jargonComplexity && notes.jargonComplexity.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium mb-2">Jargon & Complexity</h4>
            <ul className="list-disc pl-5 text-sm">
              {notes.jargonComplexity.map((item: string, index: number) => (
                <li key={`jargon-${index}`} className="mb-1">{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
  
  // Render suggested improvements
  const renderSuggestedImprovements = (improvements: string[]) => {
    if (!improvements || improvements.length === 0) return null;
    
    return (
      <div className="mb-6 border rounded-lg p-4 bg-white dark:bg-slate-950 shadow-sm">
        <h3 className="text-lg font-bold mb-3">Suggested Improvements</h3>
        <div className="space-y-2">
          {improvements.map((improvement, index) => (
            <div key={`improvement-${index}`} className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-2 mt-0.5">
                <span className="text-blue-600 dark:text-blue-300 text-xs font-bold">{index + 1}</span>
              </div>
              <p className="text-sm">{improvement}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render the enhanced pretty content
  const renderEnhancedPrettyContent = () => {
    if (!parsedContent) {
      return <div className="text-slate-400 italic">Waiting for complete JSON response...</div>;
    }
    
    return (
      <div className="p-4 space-y-4">
        {/* Summary Dashboard */}
        {parsedContent.summaryDashboard && renderSummaryDashboard(parsedContent.summaryDashboard)}
        
        {/* Storytelling Analysis */}
        {parsedContent.storytellingAnalysis && renderAnalysisSection('Storytelling Analysis', parsedContent.storytellingAnalysis)}
        
        {/* Reasoning Analysis */}
        {parsedContent.reasoningAnalysis && renderAnalysisSection('Reasoning Analysis', parsedContent.reasoningAnalysis)}
        
        {/* Notes */}
        {parsedContent.notes && renderNotes(parsedContent.notes)}
        
        {/* Suggested Improvements */}
        {parsedContent.suggestedImprovements && renderSuggestedImprovements(parsedContent.suggestedImprovements)}
      </div>
    );
  };

  // Legacy renderPrettyField and renderPrettyContent for fallback
  const renderPrettyField = (key: string, value: any, depth = 0): React.ReactNode => {
    // Handle different types of values
    if (value === null || value === undefined) {
      return (
        <div key={key} className="mb-2 pl-4" style={{ marginLeft: `${depth * 12}px` }}>
          <span className="font-medium">{key}:</span>{' '}
          <span className="text-slate-500 italic">{value === null ? 'null' : 'undefined'}</span>
        </div>
      );
    } else if (typeof value === 'string') {
      return (
        <div key={key} className="mb-2 pl-4" style={{ marginLeft: `${depth * 12}px` }}>
          <span className="font-medium">{key}:</span>{' '}
          <span className="text-emerald-600 dark:text-emerald-400">"{value}"</span>
        </div>
      );
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      return (
        <div key={key} className="mb-2 pl-4" style={{ marginLeft: `${depth * 12}px` }}>
          <span className="font-medium">{key}:</span>{' '}
          <span className="text-blue-600 dark:text-blue-400">{String(value)}</span>
        </div>
      );
    } else if (Array.isArray(value)) {
      return (
        <div key={key} className="mb-2" style={{ marginLeft: `${depth * 12}px` }}>
          <div className="pl-4 font-medium">{key}: <Badge variant="outline">{value.length} items</Badge></div>
          <div className="pl-4 ml-4 border-l border-slate-200 dark:border-slate-700 mt-1">
            {value.map((item, index) => 
              typeof item === 'object' && item !== null 
                ? (
                  <div key={index} className="mb-2">
                    <div className="font-medium">[{index}]:</div>
                    <div className="pl-4">
                      {Object.entries(item).map(([itemKey, itemValue]) => 
                        renderPrettyField(itemKey, itemValue, depth + 1)
                      )}
                    </div>
                  </div>
                ) 
                : (
                  <div key={index} className="mb-1">
                    <span className="font-medium">[{index}]:</span>{' '}
                    {typeof item === 'string' 
                      ? <span className="text-emerald-600 dark:text-emerald-400">"{item}"</span>
                      : <span className="text-blue-600 dark:text-blue-400">{String(item)}</span>
                    }
                  </div>
                )
            )}
          </div>
        </div>
      );
    } else if (typeof value === 'object') {
      return (
        <div key={key} className="mb-2" style={{ marginLeft: `${depth * 12}px` }}>
          <div className="pl-4 font-medium">{key}:</div>
          <div className="pl-4 ml-4 border-l border-slate-200 dark:border-slate-700 mt-1">
            {Object.entries(value).map(([objKey, objValue]) => 
              renderPrettyField(objKey, objValue, depth + 1)
            )}
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Legacy pretty content renderer
  const renderPrettyContent = () => {
    if (!content) {
      return <div className="text-slate-400 italic">Response will appear here...</div>;
    }
    
    if (!parsedContent) {
      return <div className="text-slate-400 italic">Waiting for complete JSON response...</div>;
    }
    
    return (
      <div className="p-2">
        {Object.entries(parsedContent).map(([key, value]) => 
          renderPrettyField(key, value)
        )}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 px-4 py-2">
            <div className="text-sm font-medium">Response</div>
            <div className="flex items-center space-x-2">
              <div className="text-xs text-slate-500">Model: {model}</div>
              {/* Only show display mode tabs in dev mode */}
              {mode === 'dev' && (
                <div className="inline-flex h-7 items-center rounded-md border p-1 text-xs">
                  <button
                    className={`rounded px-2 py-0.5 ${displayMode === 'pretty' ? 'bg-slate-200 dark:bg-slate-700' : ''}`}
                    onClick={() => setDisplayMode('pretty')}
                  >
                    Pretty
                  </button>
                  <button
                    className={`rounded px-2 py-0.5 ${displayMode === 'json' ? 'bg-slate-200 dark:bg-slate-700' : ''}`}
                    onClick={() => setDisplayMode('json')}
                  >
                    JSON
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {mode === 'dev' && displayMode === 'json' ? (
            <div 
              ref={jsonDisplayRef}
              className="p-4 max-h-[500px] overflow-y-auto whitespace-pre-wrap font-mono text-sm"
            >
              {content || <div className="text-slate-400 italic">Response will appear here...</div>}
            </div>
          ) : (
            <div 
              ref={prettyDisplayRef}
              className="p-4 max-h-[500px] overflow-y-auto font-sans text-sm"
            >
              {!content ? (
                <div className="text-slate-400 italic">Response will appear here...</div>
              ) : renderEnhancedPrettyContent()}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Token Usage Details */}
      {usageData && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium mb-2">Token Usage & Costs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                <span className="text-xs text-slate-500 dark:text-slate-400">Input Tokens</span>
                <span className="text-lg font-medium">{formatNumber(tokenDetails.inputTokens)}</span>
              </div>
              <div className="flex flex-col bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                <span className="text-xs text-slate-500 dark:text-slate-400">Output Tokens</span>
                <span className="text-lg font-medium">{formatNumber(tokenDetails.outputTokens)}</span>
              </div>
              <div className="flex flex-col bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                <span className="text-xs text-slate-500 dark:text-slate-400">Total Tokens</span>
                <span className="text-lg font-medium">{formatNumber(tokenDetails.totalTokens)}</span>
              </div>
            </div>
            
            {/* Cost information if available */}
            {(usdCostData || inrCostData) && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {usdCostData && (
                  <div className="flex flex-col bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Cost (USD)</span>
                    <div className="flex flex-col text-sm">
                      <span>Input: {formatCurrency(usdCostData.input, 'USD')}</span>
                      <span>Output: {formatCurrency(usdCostData.output, 'USD')}</span>
                      <span className="text-base font-medium mt-1">
                        Total: {formatCurrency(usdCostData.total, 'USD')}
                      </span>
                    </div>
                  </div>
                )}
                
                {inrCostData && (
                  <div className="flex flex-col bg-slate-50 dark:bg-slate-900 p-3 rounded-md">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Cost (INR)</span>
                    <div className="flex flex-col text-sm">
                      <span>Input: {formatCurrency(inrCostData.input, 'INR')}</span>
                      <span>Output: {formatCurrency(inrCostData.output, 'INR')}</span>
                      <span className="text-base font-medium mt-1">
                        Total: {formatCurrency(inrCostData.total, 'INR')}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Raw Response Data (for debugging) */}
      {response && process.env.NODE_ENV === 'development' && mode === 'dev' && (
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-medium mb-2">Raw Response Data</h3>
            <pre className="text-xs bg-slate-50 dark:bg-slate-900 p-2 rounded overflow-auto max-h-[200px]">
              {JSON.stringify(response, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 