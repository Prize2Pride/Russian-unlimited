import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  ArrowLeft,
  ArrowRight,
  ArrowLeftRight,
  Sparkles,
  Star,
  Copy,
  Check,
  RefreshCw,
  Info,
  Zap
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

const LEVEL_NAMES = [
  { id: 1, name: "Street Russian", nameRu: "Уличный русский", color: "var(--level-1)" },
  { id: 2, name: "Casual Russian", nameRu: "Разговорный русский", color: "var(--level-2)" },
  { id: 3, name: "Professional Russian", nameRu: "Деловой русский", color: "var(--level-3)" },
  { id: 4, name: "Formal Russian", nameRu: "Официальный русский", color: "var(--level-4)" },
  { id: 5, name: "Diplomatic Russian", nameRu: "Дипломатический русский", color: "var(--level-5)" }
];

// Sample transformations
const SAMPLE_TRANSFORMATIONS = [
  {
    id: 1,
    informal: "Чё как, братан? Всё норм?",
    informalLevel: 1,
    formal: "Здравствуйте, уважаемый коллега. Как у Вас дела?",
    formalLevel: 4,
    explanation: "Street greeting transformed to formal business greeting",
    category: "greetings"
  },
  {
    id: 2,
    informal: "Забей на это, фигня какая-то",
    informalLevel: 1,
    formal: "Рекомендую не придавать этому значения, данный вопрос не является приоритетным",
    formalLevel: 4,
    explanation: "Dismissive slang elevated to professional recommendation",
    category: "opinions"
  },
  {
    id: 3,
    informal: "Давай встретимся завтра, поболтаем",
    informalLevel: 2,
    formal: "Предлагаю назначить встречу на завтра для обсуждения текущих вопросов",
    formalLevel: 3,
    explanation: "Casual meeting request formalized for business context",
    category: "requests"
  },
  {
    id: 4,
    informal: "Это реально круто!",
    informalLevel: 2,
    formal: "Это действительно впечатляющий результат",
    formalLevel: 3,
    explanation: "Casual enthusiasm expressed professionally",
    category: "reactions"
  },
  {
    id: 5,
    informal: "Мне это не нравится, полный отстой",
    informalLevel: 1,
    formal: "Выражаю несогласие с данным предложением ввиду его недостаточной проработанности",
    formalLevel: 4,
    explanation: "Vulgar disapproval transformed to diplomatic disagreement",
    category: "opinions"
  },
  {
    id: 6,
    informal: "Короче, надо сделать это быстро",
    informalLevel: 2,
    formal: "В связи с ограниченными сроками, прошу обеспечить оперативное выполнение данной задачи",
    formalLevel: 4,
    explanation: "Casual urgency expressed in official language",
    category: "requests"
  }
];

function StarRating({ count, size = 14 }: { count: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < count ? "fill-[var(--gold)] text-[var(--gold)]" : "text-muted-foreground/30"}
        />
      ))}
    </div>
  );
}

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
            <Link href="/transformer" className="text-sm text-foreground font-medium">
              Transformer
            </Link>
            <Link href="/api-docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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

function TransformationCard({ transformation }: { transformation: typeof SAMPLE_TRANSFORMATIONS[0] }) {
  const [copied, setCopied] = useState<'informal' | 'formal' | null>(null);
  
  const informalLevel = LEVEL_NAMES.find(l => l.id === transformation.informalLevel);
  const formalLevel = LEVEL_NAMES.find(l => l.id === transformation.formalLevel);

  const copyToClipboard = (text: string, type: 'informal' | 'formal') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Card className="glass-card">
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informal Side */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge style={{ backgroundColor: informalLevel?.color }} className="text-white">
                  Level {transformation.informalLevel}
                </Badge>
                <span className="text-sm text-muted-foreground">{informalLevel?.name}</span>
              </div>
              <StarRating count={transformation.informalLevel} />
            </div>
            <div className="p-4 rounded-lg bg-background/50 border border-border/50 relative group">
              <p className="text-foreground font-medium pr-8">{transformation.informal}</p>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                onClick={() => copyToClipboard(transformation.informal, 'informal')}
              >
                {copied === 'informal' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden lg:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-primary" />
            </div>
          </div>

          {/* Formal Side */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge style={{ backgroundColor: formalLevel?.color }} className="text-white">
                  Level {transformation.formalLevel}
                </Badge>
                <span className="text-sm text-muted-foreground">{formalLevel?.name}</span>
              </div>
              <StarRating count={transformation.formalLevel} />
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 relative group">
              <p className="text-foreground font-medium pr-8">{transformation.formal}</p>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                onClick={() => copyToClipboard(transformation.formal, 'formal')}
              >
                {copied === 'formal' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-4 flex items-start gap-2 p-3 rounded-lg bg-muted/30">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">{transformation.explanation}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function InteractiveTransformer() {
  const [inputText, setInputText] = useState("");
  const [sourceLevel, setSourceLevel] = useState("1");
  const [targetLevel, setTargetLevel] = useState("4");
  const [isTransforming, setIsTransforming] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleTransform = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to transform");
      return;
    }
    
    setIsTransforming(true);
    // Simulate transformation (in production, this would call the API)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock result based on target level
    const mockResults: Record<string, string> = {
      "1": "Чё, типа, норм всё?",
      "2": "Ну как там у тебя дела?",
      "3": "Как продвигаются дела по проекту?",
      "4": "Прошу сообщить о текущем статусе выполнения задачи",
      "5": "Имею честь осведомиться о ходе реализации данной инициативы"
    };
    
    setResult(mockResults[targetLevel] || "Transformation complete");
    setIsTransforming(false);
  };

  const swapLevels = () => {
    const temp = sourceLevel;
    setSourceLevel(targetLevel);
    setTargetLevel(temp);
    if (result) {
      setInputText(result);
      setResult(null);
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Interactive Transformer
        </CardTitle>
        <CardDescription>
          Transform Russian text between different formality levels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Level Selection */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Source Level</label>
            <Select value={sourceLevel} onValueChange={setSourceLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEVEL_NAMES.map(level => (
                  <SelectItem key={level.id} value={level.id.toString()}>
                    <div className="flex items-center gap-2">
                      <StarRating count={level.id} size={12} />
                      <span>{level.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="ghost" size="icon" onClick={swapLevels} className="mt-6">
            <ArrowLeftRight className="w-5 h-5" />
          </Button>
          
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Target Level</label>
            <Select value={targetLevel} onValueChange={setTargetLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LEVEL_NAMES.map(level => (
                  <SelectItem key={level.id} value={level.id.toString()}>
                    <div className="flex items-center gap-2">
                      <StarRating count={level.id} size={12} />
                      <span>{level.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Input/Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Input Text</label>
            <Textarea
              placeholder="Enter Russian text to transform..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[150px] resize-none"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Transformed Output</label>
            <div className="min-h-[150px] p-3 rounded-md border border-input bg-background/50">
              {isTransforming ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Transforming...</span>
                </div>
              ) : result ? (
                <p className="text-foreground">{result}</p>
              ) : (
                <p className="text-muted-foreground">Output will appear here</p>
              )}
            </div>
          </div>
        </div>

        <Button 
          onClick={handleTransform} 
          disabled={isTransforming || !inputText.trim()}
          className="w-full gold-gradient text-background font-semibold"
        >
          {isTransforming ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Transforming...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Transform Text
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Transformer() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const categories = Array.from(new Set(SAMPLE_TRANSFORMATIONS.map(t => t.category)));
  
  const filteredTransformations = selectedCategory === "all" 
    ? SAMPLE_TRANSFORMATIONS 
    : SAMPLE_TRANSFORMATIONS.filter(t => t.category === selectedCategory);

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
            <h1 className="text-4xl font-bold mb-4">Language Transformer</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Transform Russian text between formality levels with side-by-side comparison. 
              See how informal expressions translate to formal equivalents and vice versa.
            </p>
          </div>

          {/* Interactive Transformer */}
          <div className="mb-12">
            <InteractiveTransformer />
          </div>

          {/* Example Transformations */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Example Transformations</h2>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-6">
              {filteredTransformations.map(transformation => (
                <TransformationCard key={transformation.id} transformation={transformation} />
              ))}
            </div>
          </div>

          {/* Info Card */}
          <Card className="glass-card mt-12">
            <CardContent className="py-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">About Language Transformation</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    The transformer tool demonstrates how Russian language varies across formality registers. 
                    Understanding these transformations is crucial for AI systems that need to communicate 
                    appropriately in different contexts — from casual conversations to diplomatic negotiations.
                    Each transformation preserves the core meaning while adapting tone, vocabulary, and 
                    grammatical structures to match the target formality level.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
