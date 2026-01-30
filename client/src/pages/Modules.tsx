import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { 
  Star, 
  Shield, 
  ArrowLeft,
  BookOpen,
  Search,
  Filter,
  Clock,
  FileText,
  MessageSquare,
  Sparkles,
  GraduationCap,
  PenTool,
  Globe
} from "lucide-react";
import { Link, useParams } from "wouter";
import { useState, useMemo } from "react";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  vocabulary: <BookOpen className="w-4 h-4" />,
  phrases: <MessageSquare className="w-4 h-4" />,
  idioms: <Sparkles className="w-4 h-4" />,
  grammar: <GraduationCap className="w-4 h-4" />,
  conversation: <MessageSquare className="w-4 h-4" />,
  formal_writing: <PenTool className="w-4 h-4" />,
  diplomatic: <Globe className="w-4 h-4" />
};

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "bg-green-500/20 text-green-400",
  intermediate: "bg-blue-500/20 text-blue-400",
  advanced: "bg-purple-500/20 text-purple-400",
  expert: "bg-orange-500/20 text-orange-400",
  master: "bg-red-500/20 text-red-400"
};

const LEVEL_NAMES = [
  { id: 1, name: "Street Russian", nameRu: "Уличный русский" },
  { id: 2, name: "Casual Russian", nameRu: "Разговорный русский" },
  { id: 3, name: "Professional Russian", nameRu: "Деловой русский" },
  { id: 4, name: "Formal Russian", nameRu: "Официальный русский" },
  { id: 5, name: "Diplomatic Russian", nameRu: "Дипломатический русский" }
];

// Sample modules data (would come from API in production)
const SAMPLE_MODULES = [
  // Level 1 - Street Russian
  { id: 1, levelId: 1, title: "Street Slang Basics", titleRu: "Основы уличного сленга", category: "vocabulary", difficulty: "beginner", estimatedDuration: 30, totalExamples: 150 },
  { id: 2, levelId: 1, title: "Criminal Jargon (Феня)", titleRu: "Криминальный жаргон", category: "vocabulary", difficulty: "advanced", estimatedDuration: 60, totalExamples: 200 },
  { id: 3, levelId: 1, title: "Youth Internet Slang", titleRu: "Молодёжный интернет-сленг", category: "phrases", difficulty: "intermediate", estimatedDuration: 45, totalExamples: 180 },
  { id: 4, levelId: 1, title: "Vulgar Expressions", titleRu: "Вульгарные выражения", category: "vocabulary", difficulty: "expert", estimatedDuration: 40, totalExamples: 120 },
  
  // Level 2 - Casual Russian
  { id: 5, levelId: 2, title: "Everyday Conversations", titleRu: "Повседневные разговоры", category: "conversation", difficulty: "beginner", estimatedDuration: 35, totalExamples: 200 },
  { id: 6, levelId: 2, title: "Common Idioms", titleRu: "Распространённые идиомы", category: "idioms", difficulty: "intermediate", estimatedDuration: 50, totalExamples: 100 },
  { id: 7, levelId: 2, title: "Informal Grammar", titleRu: "Неформальная грамматика", category: "grammar", difficulty: "intermediate", estimatedDuration: 60, totalExamples: 80 },
  
  // Level 3 - Professional Russian
  { id: 8, levelId: 3, title: "Business Vocabulary", titleRu: "Деловая лексика", category: "vocabulary", difficulty: "intermediate", estimatedDuration: 45, totalExamples: 250 },
  { id: 9, levelId: 3, title: "Email Etiquette", titleRu: "Этикет деловой переписки", category: "formal_writing", difficulty: "intermediate", estimatedDuration: 40, totalExamples: 60 },
  { id: 10, levelId: 3, title: "Meeting Language", titleRu: "Язык деловых встреч", category: "conversation", difficulty: "advanced", estimatedDuration: 55, totalExamples: 120 },
  
  // Level 4 - Formal Russian
  { id: 11, levelId: 4, title: "Legal Terminology", titleRu: "Юридическая терминология", category: "vocabulary", difficulty: "advanced", estimatedDuration: 70, totalExamples: 300 },
  { id: 12, levelId: 4, title: "Official Documents", titleRu: "Официальные документы", category: "formal_writing", difficulty: "expert", estimatedDuration: 80, totalExamples: 150 },
  { id: 13, levelId: 4, title: "Bureaucratic Language", titleRu: "Бюрократический язык", category: "vocabulary", difficulty: "advanced", estimatedDuration: 65, totalExamples: 200 },
  
  // Level 5 - Diplomatic Russian
  { id: 14, levelId: 5, title: "Diplomatic Protocol", titleRu: "Дипломатический протокол", category: "diplomatic", difficulty: "master", estimatedDuration: 90, totalExamples: 180 },
  { id: 15, levelId: 5, title: "International Relations", titleRu: "Международные отношения", category: "vocabulary", difficulty: "expert", estimatedDuration: 75, totalExamples: 250 },
  { id: 16, levelId: 5, title: "State Ceremony Language", titleRu: "Язык государственных церемоний", category: "diplomatic", difficulty: "master", estimatedDuration: 60, totalExamples: 100 }
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
            <Link href="/modules" className="text-sm text-foreground font-medium">
              Modules
            </Link>
            <Link href="/transformer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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

function ModuleCard({ module }: { module: typeof SAMPLE_MODULES[0] }) {
  const levelName = LEVEL_NAMES.find(l => l.id === module.levelId);
  
  return (
    <Card className="glass-card hover:border-primary/30 transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              {CATEGORY_ICONS[module.category] || <BookOpen className="w-4 h-4" />}
            </div>
            <Badge variant="outline" className="text-xs">
              {module.category.replace('_', ' ')}
            </Badge>
          </div>
          <StarRating count={module.levelId} />
        </div>
        
        <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
          {module.title}
        </CardTitle>
        <CardDescription className="text-sm">
          {module.titleRu}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{module.estimatedDuration} min</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            <span>{module.totalExamples} examples</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge className={DIFFICULTY_COLORS[module.difficulty]}>
            {module.difficulty}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {levelName?.name}
          </span>
        </div>
        
        <Button className="w-full mt-4" variant="outline">
          <BookOpen className="w-4 h-4 mr-2" />
          View Module
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Modules() {
  const params = useParams();
  const levelIdParam = params.levelId ? parseInt(params.levelId) : undefined;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>(levelIdParam?.toString() || "all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const filteredModules = useMemo(() => {
    return SAMPLE_MODULES.filter(module => {
      const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           module.titleRu?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = selectedLevel === "all" || module.levelId === parseInt(selectedLevel);
      const matchesCategory = selectedCategory === "all" || module.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === "all" || module.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesLevel && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, selectedLevel, selectedCategory, selectedDifficulty]);

  const categories = Array.from(new Set(SAMPLE_MODULES.map(m => m.category)));
  const difficulties = Array.from(new Set(SAMPLE_MODULES.map(m => m.difficulty)));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container">
          {/* Page Header */}
          <div className="mb-8">
            <Link href="/levels" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Levels
            </Link>
            <h1 className="text-4xl font-bold mb-4">Training Modules</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Comprehensive training datasets organized by proficiency level, category, and difficulty. 
              Each module contains curated examples for AI training.
            </p>
          </div>

          {/* Filters */}
          <Card className="glass-card mb-8">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search modules..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {LEVEL_NAMES.map(level => (
                      <SelectItem key={level.id} value={level.id.toString()}>
                        Level {level.id}: {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Difficulties" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    {difficulties.map(diff => (
                      <SelectItem key={diff} value={diff}>
                        {diff}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredModules.length}</span> modules
            </p>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {selectedLevel !== "all" || selectedCategory !== "all" || selectedDifficulty !== "all" 
                  ? "Filters applied" 
                  : "No filters"}
              </span>
            </div>
          </div>

          {/* Modules Grid */}
          {filteredModules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map(module => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          ) : (
            <Card className="glass-card">
              <CardContent className="py-16 text-center">
                <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No modules found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </CardContent>
            </Card>
          )}

          {/* Level Tabs Alternative View */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Browse by Level</h2>
            <Tabs defaultValue={levelIdParam?.toString() || "1"} className="w-full">
              <TabsList className="grid grid-cols-5 w-full mb-6">
                {LEVEL_NAMES.map(level => (
                  <TabsTrigger key={level.id} value={level.id.toString()} className="text-xs">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Level {level.id}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {LEVEL_NAMES.map(level => (
                <TabsContent key={level.id} value={level.id.toString()}>
                  <Card className="glass-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{level.name}</CardTitle>
                          <CardDescription>{level.nameRu}</CardDescription>
                        </div>
                        <StarRating count={level.id} size={18} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {SAMPLE_MODULES.filter(m => m.levelId === level.id).map(module => (
                          <div key={module.id} className="p-4 rounded-lg bg-background/50 border border-border/50">
                            <div className="flex items-center gap-2 mb-2">
                              {CATEGORY_ICONS[module.category]}
                              <span className="font-medium">{module.title}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{module.titleRu}</p>
                            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                              <span>{module.totalExamples} examples</span>
                              <Badge className={`${DIFFICULTY_COLORS[module.difficulty]} text-xs`}>
                                {module.difficulty}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
