import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { 
  Star, 
  Shield, 
  ArrowRight, 
  ArrowLeft,
  BookOpen,
  Users,
  Target,
  Flame,
  MessageCircle,
  Briefcase,
  FileText,
  Crown
} from "lucide-react";
import { Link } from "wouter";

const LEVEL_DATA = [
  {
    level: 1,
    stars: 1,
    nameEn: "Street Russian",
    nameRu: "Уличный русский",
    description: "Underground slang, colloquialisms, and raw informal expressions used in everyday street communication.",
    icon: <Flame className="w-8 h-8" />,
    color: "var(--level-1)",
    characteristics: [
      "Vulgar expressions and profanity",
      "Criminal jargon (феня)",
      "Youth slang and internet language",
      "Regional dialects and accents",
      "Abbreviated forms and contractions"
    ],
    usageContext: "Street conversations, informal gatherings, online forums, youth culture",
    examples: [
      { ru: "Чё как, братан?", en: "What's up, bro?" },
      { ru: "Забей на это", en: "Forget about it" },
      { ru: "Это реально круто", en: "That's really cool" }
    ]
  },
  {
    level: 2,
    stars: 2,
    nameEn: "Casual Russian",
    nameRu: "Разговорный русский",
    description: "Everyday conversational language used among friends, family, and in relaxed social settings.",
    icon: <MessageCircle className="w-8 h-8" />,
    color: "var(--level-2)",
    characteristics: [
      "Common idioms and expressions",
      "Informal greetings and farewells",
      "Colloquial vocabulary",
      "Relaxed grammar structures",
      "Emotional expressions"
    ],
    usageContext: "Family conversations, friendly gatherings, casual workplace chat, social media",
    examples: [
      { ru: "Как дела?", en: "How are you?" },
      { ru: "Давай встретимся завтра", en: "Let's meet tomorrow" },
      { ru: "Мне это нравится", en: "I like this" }
    ]
  },
  {
    level: 3,
    stars: 3,
    nameEn: "Professional Russian",
    nameRu: "Деловой русский",
    description: "Business communication language used in corporate environments and professional settings.",
    icon: <Briefcase className="w-8 h-8" />,
    color: "var(--level-3)",
    characteristics: [
      "Business terminology",
      "Professional email etiquette",
      "Meeting and presentation language",
      "Negotiation vocabulary",
      "Industry-specific jargon"
    ],
    usageContext: "Business meetings, corporate emails, presentations, professional networking",
    examples: [
      { ru: "Предлагаю обсудить этот вопрос", en: "I suggest we discuss this matter" },
      { ru: "Согласно нашей договорённости", en: "According to our agreement" },
      { ru: "Благодарю за сотрудничество", en: "Thank you for your cooperation" }
    ]
  },
  {
    level: 4,
    stars: 4,
    nameEn: "Formal Russian",
    nameRu: "Официальный русский",
    description: "Official language used in government documents, legal proceedings, and formal correspondence.",
    icon: <FileText className="w-8 h-8" />,
    color: "var(--level-4)",
    characteristics: [
      "Legal and bureaucratic terminology",
      "Official document structures",
      "Formal address forms",
      "Complex grammatical constructions",
      "Archaic and ceremonial expressions"
    ],
    usageContext: "Government documents, legal proceedings, official ceremonies, academic papers",
    examples: [
      { ru: "Настоящим уведомляем Вас", en: "We hereby notify you" },
      { ru: "В соответствии с законодательством", en: "In accordance with the legislation" },
      { ru: "Прошу принять к сведению", en: "Please take note" }
    ]
  },
  {
    level: 5,
    stars: 5,
    nameEn: "Diplomatic Russian",
    nameRu: "Дипломатический русский",
    description: "Supreme diplomatic language used in international relations, high-level negotiations, and state affairs.",
    icon: <Crown className="w-8 h-8" />,
    color: "var(--level-5)",
    characteristics: [
      "Diplomatic protocol language",
      "International relations terminology",
      "Euphemisms and indirect expressions",
      "Cultural sensitivity markers",
      "State ceremony vocabulary"
    ],
    usageContext: "International summits, diplomatic correspondence, state visits, UN proceedings",
    examples: [
      { ru: "Выражаем глубокую озабоченность", en: "We express deep concern" },
      { ru: "В духе взаимного уважения", en: "In the spirit of mutual respect" },
      { ru: "Имею честь представить", en: "I have the honor to present" }
    ]
  }
];

function StarRating({ count, size = 20 }: { count: number; size?: number }) {
  return (
    <div className="flex items-center gap-1">
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
            <Link href="/levels" className="text-sm text-foreground font-medium">
              Levels
            </Link>
            <Link href="/modules" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
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

export default function Levels() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container">
          {/* Page Header */}
          <div className="mb-12">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold mb-4">5-Star Progression System</h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Master the complete spectrum of Russian language proficiency — from underground street slang 
              to supreme diplomatic discourse. Each level represents a distinct register of communication.
            </p>
          </div>

          {/* Levels Grid */}
          <div className="space-y-8">
            {LEVEL_DATA.map((level, index) => (
              <Card 
                key={level.level} 
                className="glass-card overflow-hidden"
                style={{ borderLeftColor: level.color, borderLeftWidth: '4px' }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Level Info */}
                  <CardHeader className="lg:col-span-1">
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className="w-16 h-16 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `color-mix(in oklch, ${level.color} 20%, transparent)` }}
                      >
                        <div style={{ color: level.color }}>{level.icon}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Level {level.level}
                      </Badge>
                    </div>
                    
                    <StarRating count={level.stars} />
                    
                    <CardTitle className="text-2xl mt-3">{level.nameEn}</CardTitle>
                    <CardDescription className="text-base font-medium" style={{ color: level.color }}>
                      {level.nameRu}
                    </CardDescription>
                    
                    <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                      {level.description}
                    </p>
                    
                    <Link href={`/modules/${level.level}`}>
                      <Button className="mt-6 w-full" style={{ backgroundColor: level.color }}>
                        <BookOpen className="w-4 h-4 mr-2" />
                        Explore Modules
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardHeader>

                  {/* Characteristics & Context */}
                  <CardContent className="lg:col-span-1 pt-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="w-4 h-4 text-primary" />
                      Characteristics
                    </h4>
                    <ul className="space-y-2">
                      {level.characteristics.map((char, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: level.color }} />
                          {char}
                        </li>
                      ))}
                    </ul>
                    
                    <h4 className="font-semibold mt-6 mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      Usage Context
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {level.usageContext}
                    </p>
                  </CardContent>

                  {/* Examples */}
                  <CardContent className="lg:col-span-1 pt-6 bg-card/50">
                    <h4 className="font-semibold mb-4">Example Phrases</h4>
                    <div className="space-y-4">
                      {level.examples.map((example, i) => (
                        <div key={i} className="p-3 rounded-lg bg-background/50 border border-border/50">
                          <p className="font-medium text-foreground">{example.ru}</p>
                          <p className="text-sm text-muted-foreground mt-1">{example.en}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <Card className="glass-card p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Ready to Start Training?</h3>
              <p className="text-muted-foreground mb-6">
                Access comprehensive training modules and datasets for each proficiency level.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link href="/modules">
                  <Button size="lg" className="gold-gradient text-background font-semibold">
                    Browse All Modules
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/transformer">
                  <Button size="lg" variant="outline">
                    Try Transformer
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
