import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  ArrowLeft,
  Copy,
  Check,
  Code,
  Database,
  Key,
  BookOpen,
  Zap,
  Globe,
  Lock,
  FileJson
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

const API_ENDPOINTS = [
  {
    method: "GET",
    path: "/api/trpc/levels.list",
    description: "Retrieve all language proficiency levels",
    auth: false,
    response: `{
  "result": {
    "data": [
      {
        "id": 1,
        "level": 1,
        "starRating": 1,
        "nameRu": "Уличный русский",
        "nameEn": "Street Russian",
        "description": "Underground slang..."
      }
    ]
  }
}`
  },
  {
    method: "GET",
    path: "/api/trpc/modules.list",
    description: "Retrieve training modules, optionally filtered by level",
    auth: false,
    params: "?input={\"levelId\": 1}",
    response: `{
  "result": {
    "data": [
      {
        "id": 1,
        "levelId": 1,
        "title": "Street Slang Basics",
        "category": "vocabulary",
        "difficulty": "beginner",
        "totalExamples": 150
      }
    ]
  }
}`
  },
  {
    method: "GET",
    path: "/api/trpc/examples.list",
    description: "Retrieve language examples with filtering options",
    auth: false,
    params: "?input={\"levelId\": 1, \"limit\": 50}",
    response: `{
  "result": {
    "data": [
      {
        "id": 1,
        "textRu": "Чё как, братан?",
        "textEn": "What's up, bro?",
        "context": "Street greeting",
        "tone": "vulgar"
      }
    ]
  }
}`
  },
  {
    method: "GET",
    path: "/api/trpc/examples.search",
    description: "Search language examples by text query",
    auth: false,
    params: "?input={\"query\": \"привет\", \"levelId\": 2}",
    response: `{
  "result": {
    "data": [
      {
        "id": 5,
        "textRu": "Привет, как дела?",
        "textEn": "Hi, how are you?",
        "context": "Casual greeting"
      }
    ]
  }
}`
  },
  {
    method: "GET",
    path: "/api/trpc/transformations.list",
    description: "Retrieve informal-to-formal language transformations",
    auth: false,
    response: `{
  "result": {
    "data": [
      {
        "id": 1,
        "informalText": "Чё как?",
        "informalLevel": 1,
        "formalText": "Как Ваши дела?",
        "formalLevel": 4,
        "explanationEn": "Greeting transformation"
      }
    ]
  }
}`
  },
  {
    method: "GET",
    path: "/api/trpc/sessions.list",
    description: "Retrieve user's training sessions",
    auth: true,
    response: `{
  "result": {
    "data": [
      {
        "id": 1,
        "aiEntityName": "GPT-4 Instance",
        "status": "completed",
        "examplesProcessed": 450,
        "accuracy": 94
      }
    ]
  }
}`
  },
  {
    method: "POST",
    path: "/api/trpc/sessions.create",
    description: "Create a new AI training session",
    auth: true,
    body: `{
  "aiEntityName": "My AI Model",
  "aiEntityVersion": "1.0",
  "moduleId": 1,
  "levelId": 1
}`,
    response: `{
  "result": {
    "data": {
      "success": true
    }
  }
}`
  },
  {
    method: "GET",
    path: "/api/trpc/dashboard.stats",
    description: "Retrieve platform statistics",
    auth: true,
    response: `{
  "result": {
    "data": {
      "totalModules": 16,
      "totalExamples": 2380,
      "totalSessions": 47,
      "totalUsers": 12
    }
  }
}`
  }
];

const CODE_EXAMPLES = {
  javascript: `// JavaScript/Node.js Example
const BASE_URL = 'https://your-domain.com';

// Fetch all language levels
async function getLevels() {
  const response = await fetch(\`\${BASE_URL}/api/trpc/levels.list\`);
  const data = await response.json();
  return data.result.data;
}

// Search examples with authentication
async function searchExamples(query, levelId, token) {
  const input = encodeURIComponent(JSON.stringify({ query, levelId }));
  const response = await fetch(
    \`\${BASE_URL}/api/trpc/examples.search?input=\${input}\`,
    {
      headers: {
        'Cookie': \`session=\${token}\`
      }
    }
  );
  return response.json();
}

// Create training session
async function createSession(sessionData, token) {
  const response = await fetch(\`\${BASE_URL}/api/trpc/sessions.create\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': \`session=\${token}\`
    },
    body: JSON.stringify(sessionData)
  });
  return response.json();
}`,

  python: `# Python Example
import requests
import json

BASE_URL = 'https://your-domain.com'

def get_levels():
    """Fetch all language levels"""
    response = requests.get(f'{BASE_URL}/api/trpc/levels.list')
    return response.json()['result']['data']

def search_examples(query: str, level_id: int, session_token: str):
    """Search examples with authentication"""
    params = {'input': json.dumps({'query': query, 'levelId': level_id})}
    cookies = {'session': session_token}
    response = requests.get(
        f'{BASE_URL}/api/trpc/examples.search',
        params=params,
        cookies=cookies
    )
    return response.json()

def create_training_session(session_data: dict, session_token: str):
    """Create a new AI training session"""
    cookies = {'session': session_token}
    response = requests.post(
        f'{BASE_URL}/api/trpc/sessions.create',
        json=session_data,
        cookies=cookies
    )
    return response.json()

# Usage example
if __name__ == '__main__':
    # Get all levels (no auth required)
    levels = get_levels()
    print(f"Found {len(levels)} language levels")
    
    # Search examples (auth required)
    token = 'your-session-token'
    results = search_examples('привет', 2, token)
    print(f"Found {len(results['result']['data'])} examples")`,

  curl: `# cURL Examples

# Get all language levels (no auth)
curl -X GET "https://your-domain.com/api/trpc/levels.list"

# Get modules for a specific level
curl -X GET "https://your-domain.com/api/trpc/modules.list?input=%7B%22levelId%22%3A1%7D"

# Search examples (with auth)
curl -X GET "https://your-domain.com/api/trpc/examples.search?input=%7B%22query%22%3A%22%D0%BF%D1%80%D0%B8%D0%B2%D0%B5%D1%82%22%7D" \\
  -H "Cookie: session=your-session-token"

# Create training session (with auth)
curl -X POST "https://your-domain.com/api/trpc/sessions.create" \\
  -H "Content-Type: application/json" \\
  -H "Cookie: session=your-session-token" \\
  -d '{"aiEntityName":"My AI Model","levelId":1}'

# Get dashboard stats (with auth)
curl -X GET "https://your-domain.com/api/trpc/dashboard.stats" \\
  -H "Cookie: session=your-session-token"`
};

function Header() {
  return (
    <header className="institutional-header sticky top-0 z-50 backdrop-blur-xl">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gold-gradient flex items-center justify-center">
              <Shield className="w-6 h-6 text-background" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gold-gradient">Prize2Pride</h1>
              <p className="text-xs text-muted-foreground">Russian AI Training Platform</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/levels" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Levels
            </Link>
            <Link href="/modules" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Modules
            </Link>
            <Link href="/transformer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Transformer
            </Link>
            <Link href="/api-docs" className="text-sm text-foreground font-medium">
              API
            </Link>
          </nav>

          <Link href="/dashboard">
            <Button variant="outline" size="sm" className="border-border/50">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8"
        onClick={copyCode}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </Button>
      <pre className="p-4 rounded-lg bg-background/80 border border-border/50 overflow-x-auto text-sm">
        <code className="text-muted-foreground">{code}</code>
      </pre>
    </div>
  );
}

function EndpointCard({ endpoint }: { endpoint: typeof API_ENDPOINTS[0] }) {
  const [expanded, setExpanded] = useState(false);
  const methodColors: Record<string, string> = {
    GET: "bg-green-500/20 text-green-400",
    POST: "bg-blue-500/20 text-blue-400",
    PUT: "bg-yellow-500/20 text-yellow-400",
    DELETE: "bg-red-500/20 text-red-400"
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Badge className={methodColors[endpoint.method]}>
              {endpoint.method}
            </Badge>
            <code className="text-sm font-mono">{endpoint.path}</code>
          </div>
          {endpoint.auth && (
            <Badge variant="outline" className="text-xs">
              <Lock className="w-3 h-3 mr-1" />
              Auth Required
            </Badge>
          )}
        </div>
        <CardDescription className="mt-2">
          {endpoint.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {endpoint.params && (
          <div className="mb-4">
            <p className="text-xs font-medium text-muted-foreground mb-1">Query Parameters:</p>
            <code className="text-xs bg-background/50 px-2 py-1 rounded">{endpoint.params}</code>
          </div>
        )}
        
        {endpoint.body && (
          <div className="mb-4">
            <p className="text-xs font-medium text-muted-foreground mb-1">Request Body:</p>
            <CodeBlock code={endpoint.body} language="json" />
          </div>
        )}
        
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
            className="mb-2"
          >
            <FileJson className="w-4 h-4 mr-2" />
            {expanded ? "Hide" : "Show"} Response
          </Button>
          
          {expanded && (
            <CodeBlock code={endpoint.response} language="json" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ApiDocs() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container">
          {/* Page Header */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Integrate Prize2Pride training data into your institutional AI systems. 
              Our tRPC-based API provides type-safe access to all language modules and training datasets.
            </p>
          </div>

          {/* Quick Start */}
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-5 h-5 text-primary" />
                    <span className="font-medium">Base URL</span>
                  </div>
                  <code className="text-sm text-muted-foreground">https://your-domain.com/api/trpc</code>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="w-5 h-5 text-primary" />
                    <span className="font-medium">Authentication</span>
                  </div>
                  <code className="text-sm text-muted-foreground">Session cookie-based</code>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-5 h-5 text-primary" />
                    <span className="font-medium">Format</span>
                  </div>
                  <code className="text-sm text-muted-foreground">JSON (tRPC protocol)</code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Examples */}
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Code Examples
              </CardTitle>
              <CardDescription>
                Integration examples in popular programming languages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="javascript">
                <TabsList className="mb-4">
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                </TabsList>
                
                <TabsContent value="javascript">
                  <CodeBlock code={CODE_EXAMPLES.javascript} language="javascript" />
                </TabsContent>
                
                <TabsContent value="python">
                  <CodeBlock code={CODE_EXAMPLES.python} language="python" />
                </TabsContent>
                
                <TabsContent value="curl">
                  <CodeBlock code={CODE_EXAMPLES.curl} language="bash" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* API Endpoints */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">API Endpoints</h2>
            <div className="space-y-4">
              {API_ENDPOINTS.map((endpoint, index) => (
                <EndpointCard key={index} endpoint={endpoint} />
              ))}
            </div>
          </div>

          {/* Authentication Info */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Prize2Pride uses session-based authentication via Manus OAuth. To access protected endpoints:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Authenticate through the institutional login portal</li>
                <li>Obtain your session cookie from the authentication response</li>
                <li>Include the session cookie in all subsequent API requests</li>
                <li>Session tokens expire after 24 hours of inactivity</li>
              </ol>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mt-4">
                <p className="text-sm">
                  <strong>Note:</strong> Public endpoints (levels, modules, examples) can be accessed without authentication 
                  for read-only operations. Write operations and session management require authentication.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
