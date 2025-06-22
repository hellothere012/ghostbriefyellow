const Anthropic = require('@anthropic-ai/sdk');

interface Article {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  creator?: string;
  categories?: string[];
}

interface AnalyzedSignal {
  title: string;
  summary: string;
  content: string;
  sourceUrl: string;
  sourceType: string;
  escalationRisk: string;
  credibility: number;
  signalScore: number;
  category: string[];
  region: string[];
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const ANALYSIS_PROMPT = `You are an intelligence analyst. Analyze this article and extract key intelligence information.

Return a JSON object with:
- summary: Brief 2-3 sentence summary focusing on intelligence value
- escalationRisk: "LOW", "MEDIUM", "HIGH", or "CRITICAL"
- credibility: Number 0-100 based on source and content quality
- signalScore: Number 0-100 representing intelligence value
- category: Array of relevant categories from: ["MILITARY", "TECHNOLOGY", "CYBERSECURITY", "GEOPOLITICS", "FINANCE", "HEALTH", "SCIENCE"]
- region: Array of relevant regions/countries mentioned

Article:
Title: {title}
Content: {content}

Respond only with valid JSON.`;

export async function analyzeWithClaude(articles: Article[]): Promise<AnalyzedSignal[]> {
  const signals: AnalyzedSignal[] = [];
  
  for (const article of articles) {
    try {
      console.log(`🤖 Analyzing with Claude: ${article.title}`);
      
      const prompt = ANALYSIS_PROMPT
        .replace('{title}', article.title)
        .replace('{content}', article.content.substring(0, 3000)); // Limit content length
      
      const response = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });
      
      const analysisText = response.content[0]?.text || '{}';
      
      try {
        const analysis = JSON.parse(analysisText);
        
        const signal: AnalyzedSignal = {
          title: article.title,
          summary: analysis.summary || 'No summary available',
          content: article.content,
          sourceUrl: article.link,
          sourceType: 'RSS_FEED',
          escalationRisk: analysis.escalationRisk || 'LOW',
          credibility: analysis.credibility || 50,
          signalScore: analysis.signalScore || 30,
          category: Array.isArray(analysis.category) ? analysis.category : ['GENERAL'],
          region: Array.isArray(analysis.region) ? analysis.region : []
        };
        
        signals.push(signal);
        console.log(`✅ Successfully analyzed: ${article.title} (Score: ${signal.signalScore})`);
        
      } catch (parseError) {
        console.error(`❌ Failed to parse Claude response for: ${article.title}`, parseError);
        
        // Fallback signal with basic analysis
        signals.push({
          title: article.title,
          summary: article.content.substring(0, 200) + '...',
          content: article.content,
          sourceUrl: article.link,
          sourceType: 'RSS_FEED',
          escalationRisk: 'LOW',
          credibility: 50,
          signalScore: 30,
          category: ['GENERAL'],
          region: []
        });
      }
      
      // Rate limiting for Claude API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Claude API error for: ${article.title}`, error);
      continue;
    }
  }
  
  return signals;
}