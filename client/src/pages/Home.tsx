import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { 
  Star, 
  Shield, 
  BookOpen, 
  ArrowRight, 
  Zap, 
  Database, 
  Lock,
  Globe,
  ChevronRight,
  Award,
  Users,
  BarChart3
} from "lucide-react";
import { Link } from "wouter";

const LANGUAGE_LEVELS = [
  {
    level: 1,
    stars: 1,
    nameEn: "Street Russian",
    nameRu: "Уличный русский",
    description: "Underground slang, colloquialisms, and informal expressions",
    color: "var(--level-1)",
    icon: "🔥"
  },
  {
    level: 2,
    stars: 2,
    nameEn: "Casual Russian",
    nameRu: "Разговорный русский",
    description: "Everyday conversational language and common idioms",
    color: "var(--level-2)",
    icon: "💬"
  },
  {
    level: 3,
    stars: 3,
    nameEn: "Professional Russian",
    nameRu: "Деловой русский",
    description: "Business communication and professional terminology",
    color: "var(--level-3)",
    icon: "💼"
  },
  {
    level: 4,
    stars: 4,
    nameEn: "Formal Russian",
    nameRu: "Официальный русский",
    description: "Official documentation and formal correspondence",
    color: "var(--level-4)",
    icon: "📜"
  },
  {
    level: 5,
    stars: 5,
    nameEn: "Diplomatic Russian",
    nameRu: "Дипломатический русский",
    description: "Supreme diplomatic language and high-level negotiations",
    color: "var(--level-5)",
    icon: "👑"
  }
];

function StarRating({ count, size = 16 }: { count: number; size?: number }) {
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
  const { user, loading, isAuthenticated, logout } = useAuth();

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
            <Link href="/api-docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              API
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="border-border/50">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => logout()}>
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <a href={getLoginUrl()}>
                <Button className="gold-gradient text-background font-semibold">
                  <Lock className="w-4 h-4 mr-2" />
                  Institutional Login
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function HeroSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--gold)_0%,_transparent_50%)] opacity-5" />
      
      <div className="container relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Institutional AI Training Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="text-gold-gradient">Unlimited</span>
            <br />
            <span className="text-foreground">Russian Language</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Train AI systems on the complete spectrum of Russian language — from underground street slang 
            to supreme diplomatic discourse. No boundaries. No barriers.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/levels">
              <Button size="lg" className="gold-gradient text-background font-semibold px-8">
                Explore 5-Star System
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/api-docs">
              <Button size="lg" variant="outline" className="border-border/50 px-8">
                <Database className="w-5 h-5 mr-2" />
                API Documentation
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center justify-center gap-8 mt-12 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span>Government Agencies</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Intelligence Services</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span>Red Teams</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LevelsPreview() {
  return (
    <section className="py-20 bg-card/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">5-Star Progression System</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From the streets of Moscow to the halls of the Kremlin — master every register of Russian language
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {LANGUAGE_LEVELS.map((level) => (
            <Link key={level.level} href={`/modules/${level.level}`}>
              <Card className="glass-card hover:border-primary/50 transition-all duration-300 cursor-pointer group h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{level.icon}</span>
                    <StarRating count={level.stars} size={14} />
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {level.nameEn}
                  </CardTitle>
                  <CardDescription className="text-xs font-medium" style={{ color: level.color }}>
                    {level.nameRu}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {level.description}
                  </p>
                  <div className="flex items-center gap-1 mt-4 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explore modules</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Link href="/levels">
            <Button variant="outline" className="border-border/50">
              View All Levels
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Language Transformer",
      description: "Convert informal Russian to formal equivalents with side-by-side comparison and contextual explanations."
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Training Datasets",
      description: "Comprehensive datasets organized by proficiency level, context, and usage scenario for AI training."
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Training Modules",
      description: "Structured learning modules covering vocabulary, phrases, idioms, grammar, and diplomatic language."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics Dashboard",
      description: "Track AI training progress, performance metrics, and dataset consumption with detailed analytics."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "API Integration",
      description: "RESTful API endpoints for seamless integration with institutional AI systems and training pipelines."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Secure Access",
      description: "Role-based access control with institutional authentication for government and authorized entities."
    }
  ];

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Platform Capabilities</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade tools for training AI systems on unlimited Russian language proficiency
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card hover:border-primary/30 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-20 bg-card/30">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Award className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Institutional Access</span>
          </div>
          
          <h2 className="text-3xl font-bold mb-4">
            Ready to Train Your AI?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Access unlimited Russian language training data for your institutional AI systems. 
            From basic comprehension to diplomatic mastery.
          </p>
          
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button size="lg" className="gold-gradient text-background font-semibold px-8">
                Go to Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          ) : (
            <a href={getLoginUrl()}>
              <Button size="lg" className="gold-gradient text-background font-semibold px-8">
                Request Institutional Access
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 border-t border-border/50">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
              <Shield className="w-5 h-5 text-background" />
            </div>
            <div>
              <span className="font-bold text-gold-gradient">Prize2Pride</span>
              <p className="text-xs text-muted-foreground">Russian AI Training Platform</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/levels" className="hover:text-foreground transition-colors">Levels</Link>
            <Link href="/modules" className="hover:text-foreground transition-colors">Modules</Link>
            <Link href="/transformer" className="hover:text-foreground transition-colors">Transformer</Link>
            <Link href="/api-docs" className="hover:text-foreground transition-colors">API</Link>
          </nav>
          
          <p className="text-xs text-muted-foreground">
            © 2026 Prize2Pride. Institutional Use Only.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <LevelsPreview />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
