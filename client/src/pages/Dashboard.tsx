import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { 
  Shield, 
  ArrowLeft,
  BookOpen,
  Star,
  BarChart3,
  TrendingUp,
  Clock,
  Database,
  Users,
  Activity,
  FileText,
  Zap,
  Lock,
  Calendar,
  CheckCircle2,
  XCircle,
  Pause
} from "lucide-react";
import { Link } from "wouter";

const MOCK_STATS = {
  totalModules: 16,
  totalExamples: 2380,
  totalSessions: 47,
  totalUsers: 12
};

const MOCK_SESSIONS = [
  { id: 1, aiEntityName: "GPT-4 Instance", status: "completed", examplesProcessed: 450, accuracy: 94, startedAt: "2026-01-28T10:30:00Z", completedAt: "2026-01-28T14:45:00Z", levelId: 3 },
  { id: 2, aiEntityName: "Claude-3 Training", status: "in_progress", examplesProcessed: 280, accuracy: 91, startedAt: "2026-01-29T09:00:00Z", completedAt: null, levelId: 4 },
  { id: 3, aiEntityName: "Gemini Pro", status: "completed", examplesProcessed: 520, accuracy: 96, startedAt: "2026-01-27T08:15:00Z", completedAt: "2026-01-27T16:30:00Z", levelId: 5 },
  { id: 4, aiEntityName: "LLaMA-3 Fine-tune", status: "paused", examplesProcessed: 150, accuracy: 88, startedAt: "2026-01-29T14:00:00Z", completedAt: null, levelId: 2 },
  { id: 5, aiEntityName: "Mistral-7B", status: "completed", examplesProcessed: 380, accuracy: 92, startedAt: "2026-01-26T11:00:00Z", completedAt: "2026-01-26T18:20:00Z", levelId: 1 }
];

const LEVEL_PROGRESS = [
  { level: 1, name: "Street Russian", progress: 85, examples: 450 },
  { level: 2, name: "Casual Russian", progress: 72, examples: 380 },
  { level: 3, name: "Professional Russian", progress: 68, examples: 430 },
  { level: 4, name: "Formal Russian", progress: 45, examples: 650 },
  { level: 5, name: "Diplomatic Russian", progress: 30, examples: 470 }
];

const STATUS_CONFIG = {
  completed: { icon: <CheckCircle2 className="w-4 h-4" />, color: "text-green-400", bg: "bg-green-500/20" },
  in_progress: { icon: <Activity className="w-4 h-4" />, color: "text-blue-400", bg: "bg-blue-500/20" },
  paused: { icon: <Pause className="w-4 h-4" />, color: "text-yellow-400", bg: "bg-yellow-500/20" },
  failed: { icon: <XCircle className="w-4 h-4" />, color: "text-red-400", bg: "bg-red-500/20" }
};

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
  const { user, logout } = useAuth();
  
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
            {user && (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {user.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => logout()}>
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function StatCard({ title, value, icon, description }: { title: string; value: string | number; icon: React.ReactNode; description?: string }) {
  return (
    <Card className="glass-card">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SessionRow({ session }: { session: typeof MOCK_SESSIONS[0] }) {
  const statusConfig = STATUS_CONFIG[session.status as keyof typeof STATUS_CONFIG];
  
  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-lg ${statusConfig.bg} flex items-center justify-center ${statusConfig.color}`}>
          {statusConfig.icon}
        </div>
        <div>
          <p className="font-medium">{session.aiEntityName}</p>
          <div className="flex items-center gap-2 mt-1">
            <StarRating count={session.levelId} size={12} />
            <span className="text-xs text-muted-foreground">Level {session.levelId}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="text-right">
          <p className="text-sm font-medium">{session.examplesProcessed} examples</p>
          <p className="text-xs text-muted-foreground">processed</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">{session.accuracy}%</p>
          <p className="text-xs text-muted-foreground">accuracy</p>
        </div>
        <Badge className={`${statusConfig.bg} ${statusConfig.color}`}>
          {session.status.replace('_', ' ')}
        </Badge>
      </div>
    </div>
  );
}

function AuthRequired() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <Card className="glass-card max-w-md w-full mx-4">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-6">
              Please log in with your institutional credentials to access the dashboard.
            </p>
            <a href={getLoginUrl()}>
              <Button className="gold-gradient text-background font-semibold w-full">
                <Shield className="w-4 h-4 mr-2" />
                Institutional Login
              </Button>
            </a>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthRequired />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container">
          {/* Page Header */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Training Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Monitor AI training progress and performance metrics
                </p>
              </div>
              <Button className="gold-gradient text-background font-semibold">
                <Zap className="w-4 h-4 mr-2" />
                New Training Session
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard 
              title="Total Modules" 
              value={MOCK_STATS.totalModules} 
              icon={<BookOpen className="w-5 h-5" />}
              description="Across all levels"
            />
            <StatCard 
              title="Training Examples" 
              value={MOCK_STATS.totalExamples.toLocaleString()} 
              icon={<Database className="w-5 h-5" />}
              description="Available for training"
            />
            <StatCard 
              title="Training Sessions" 
              value={MOCK_STATS.totalSessions} 
              icon={<Activity className="w-5 h-5" />}
              description="Total completed"
            />
            <StatCard 
              title="Active Users" 
              value={MOCK_STATS.totalUsers} 
              icon={<Users className="w-5 h-5" />}
              description="Institutional accounts"
            />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Training Sessions */}
            <div className="lg:col-span-2">
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Training Sessions</CardTitle>
                      <CardDescription>AI entity training progress</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {MOCK_SESSIONS.map(session => (
                    <SessionRow key={session.id} session={session} />
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Level Progress */}
            <div>
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Level Coverage</CardTitle>
                  <CardDescription>Training progress by level</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {LEVEL_PROGRESS.map(level => (
                    <div key={level.level}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <StarRating count={level.level} size={12} />
                          <span className="text-sm font-medium">{level.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{level.progress}%</span>
                      </div>
                      <Progress value={level.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {level.examples} examples available
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="glass-card mt-6">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/modules">
                    <Button variant="outline" className="w-full justify-start">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Browse Modules
                    </Button>
                  </Link>
                  <Link href="/transformer">
                    <Button variant="outline" className="w-full justify-start">
                      <Zap className="w-4 h-4 mr-2" />
                      Language Transformer
                    </Button>
                  </Link>
                  <Link href="/api-docs">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      API Documentation
                    </Button>
                  </Link>
                  {user?.role === 'admin' && (
                    <Link href="/admin">
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Performance Metrics */}
          <Card className="glass-card mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Performance Overview
              </CardTitle>
              <CardDescription>
                Aggregate training metrics across all sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-4 rounded-lg bg-background/50 border border-border/50 text-center">
                  <p className="text-3xl font-bold text-green-400">93.2%</p>
                  <p className="text-sm text-muted-foreground mt-1">Average Accuracy</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border/50 text-center">
                  <p className="text-3xl font-bold text-blue-400">1,780</p>
                  <p className="text-sm text-muted-foreground mt-1">Examples Processed</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border/50 text-center">
                  <p className="text-3xl font-bold text-purple-400">4.2h</p>
                  <p className="text-sm text-muted-foreground mt-1">Avg Session Duration</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border/50 text-center">
                  <p className="text-3xl font-bold text-primary">87%</p>
                  <p className="text-sm text-muted-foreground mt-1">Completion Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
