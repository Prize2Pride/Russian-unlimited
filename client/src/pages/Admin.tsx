import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getLoginUrl } from "@/const";
import { 
  Shield, 
  ArrowLeft,
  Plus,
  Users,
  Database,
  Settings,
  BookOpen,
  Star,
  Edit,
  Trash2,
  Lock,
  Search,
  MoreVertical,
  UserCog,
  Building2,
  Activity
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";

const MOCK_USERS = [
  { id: 1, name: "John Smith", email: "john@cia.gov", role: "admin", institution: "CIA", lastSignedIn: "2026-01-29T14:30:00Z" },
  { id: 2, name: "Sarah Johnson", email: "sarah@fbi.gov", role: "institution", institution: "FBI", lastSignedIn: "2026-01-29T10:15:00Z" },
  { id: 3, name: "Michael Chen", email: "mchen@nsa.gov", role: "institution", institution: "NSA", lastSignedIn: "2026-01-28T16:45:00Z" },
  { id: 4, name: "Elena Petrova", email: "elena@research.edu", role: "user", institution: "MIT Research", lastSignedIn: "2026-01-27T09:00:00Z" },
  { id: 5, name: "David Kim", email: "dkim@darpa.mil", role: "institution", institution: "DARPA", lastSignedIn: "2026-01-29T08:30:00Z" }
];

const MOCK_MODULES = [
  { id: 1, title: "Street Slang Basics", levelId: 1, category: "vocabulary", totalExamples: 150, isActive: true },
  { id: 2, title: "Criminal Jargon", levelId: 1, category: "vocabulary", totalExamples: 200, isActive: true },
  { id: 3, title: "Everyday Conversations", levelId: 2, category: "conversation", totalExamples: 200, isActive: true },
  { id: 4, title: "Business Vocabulary", levelId: 3, category: "vocabulary", totalExamples: 250, isActive: true },
  { id: 5, title: "Legal Terminology", levelId: 4, category: "vocabulary", totalExamples: 300, isActive: false },
  { id: 6, title: "Diplomatic Protocol", levelId: 5, category: "diplomatic", totalExamples: 180, isActive: true }
];

const LEVEL_NAMES = [
  { id: 1, name: "Street Russian" },
  { id: 2, name: "Casual Russian" },
  { id: 3, name: "Professional Russian" },
  { id: 4, name: "Formal Russian" },
  { id: 5, name: "Diplomatic Russian" }
];

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-500/20 text-red-400",
  institution: "bg-blue-500/20 text-blue-400",
  user: "bg-green-500/20 text-green-400"
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
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </Link>
          
          <div className="flex items-center gap-3">
            {user && (
              <>
                <Badge className="bg-red-500/20 text-red-400">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {user.name?.charAt(0) || "A"}
                    </span>
                  </div>
                  <span className="text-sm font-medium hidden sm:inline">{user.name}</span>
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

function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredUsers = MOCK_USERS.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.institution.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gold-gradient text-background">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new institutional user account
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Name</Label>
                <Input placeholder="Full name" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="email@institution.gov" />
              </div>
              <div>
                <Label>Institution</Label>
                <Input placeholder="Institution name" />
              </div>
              <div>
                <Label>Role</Label>
                <Select defaultValue="user">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="institution">Institution</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={() => toast.success("User created successfully")}>
                Create User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="space-y-2">
            {filteredUsers.map(user => (
              <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm">{user.institution}</p>
                    <p className="text-xs text-muted-foreground">
                      Last active: {new Date(user.lastSignedIn).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={ROLE_COLORS[user.role]}>
                    {user.role}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ModuleManagement() {
  const [selectedLevel, setSelectedLevel] = useState("all");
  
  const filteredModules = selectedLevel === "all" 
    ? MOCK_MODULES 
    : MOCK_MODULES.filter(m => m.levelId === parseInt(selectedLevel));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="w-[200px]">
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
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gold-gradient text-background">
              <Plus className="w-4 h-4 mr-2" />
              Add Module
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Module</DialogTitle>
              <DialogDescription>
                Create a new training module
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Title</Label>
                <Input placeholder="Module title" />
              </div>
              <div>
                <Label>Title (Russian)</Label>
                <Input placeholder="Название модуля" />
              </div>
              <div>
                <Label>Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVEL_NAMES.map(level => (
                      <SelectItem key={level.id} value={level.id.toString()}>
                        Level {level.id}: {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vocabulary">Vocabulary</SelectItem>
                    <SelectItem value="phrases">Phrases</SelectItem>
                    <SelectItem value="idioms">Idioms</SelectItem>
                    <SelectItem value="grammar">Grammar</SelectItem>
                    <SelectItem value="conversation">Conversation</SelectItem>
                    <SelectItem value="formal_writing">Formal Writing</SelectItem>
                    <SelectItem value="diplomatic">Diplomatic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea placeholder="Module description" />
              </div>
              <Button className="w-full" onClick={() => toast.success("Module created successfully")}>
                Create Module
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredModules.map(module => {
          const level = LEVEL_NAMES.find(l => l.id === module.levelId);
          return (
            <Card key={module.id} className="glass-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription>{level?.name}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={module.isActive ? "default" : "secondary"}>
                      {module.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <StarRating count={module.levelId} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <span>{module.category}</span>
                  <span>{module.totalExamples} examples</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Examples
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function SystemSettings() {
  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
          <CardDescription>Configure global platform settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Platform Name</Label>
              <Input defaultValue="Prize2Pride" className="mt-2" />
            </div>
            <div>
              <Label>Default Language</Label>
              <Select defaultValue="en">
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ru">Russian</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label>Platform Description</Label>
            <Textarea 
              defaultValue="Elite institutional-grade Russian Language AI Training Platform"
              className="mt-2"
            />
          </div>
          
          <Button onClick={() => toast.success("Settings saved")}>
            Save Settings
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>Manage API access and rate limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Rate Limit (requests/hour)</Label>
              <Input type="number" defaultValue="1000" className="mt-2" />
            </div>
            <div>
              <Label>Session Timeout (hours)</Label>
              <Input type="number" defaultValue="24" className="mt-2" />
            </div>
          </div>
          <Button onClick={() => toast.success("API settings saved")}>
            Save API Settings
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/50">
            <div>
              <p className="font-medium">Clear All Training Sessions</p>
              <p className="text-sm text-muted-foreground">Remove all training session data</p>
            </div>
            <Button variant="destructive" size="sm">
              Clear Sessions
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/50">
            <div>
              <p className="font-medium">Reset API Access Logs</p>
              <p className="text-sm text-muted-foreground">Clear all API access history</p>
            </div>
            <Button variant="destructive" size="sm">
              Reset Logs
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AccessDenied() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center py-12">
        <Card className="glass-card max-w-md w-full mx-4">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-6">
              You do not have permission to access the admin panel. 
              Please contact your administrator for access.
            </p>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                Return to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
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
              Please log in with your admin credentials to access this panel.
            </p>
            <a href={getLoginUrl()}>
              <Button className="gold-gradient text-background font-semibold w-full">
                <Shield className="w-4 h-4 mr-2" />
                Admin Login
              </Button>
            </a>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function Admin() {
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

  if (user?.role !== 'admin') {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container">
          {/* Page Header */}
          <div className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground mt-1">
              Manage users, modules, and platform settings
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{MOCK_USERS.length}</p>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{MOCK_MODULES.length}</p>
                    <p className="text-sm text-muted-foreground">Modules</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">5</p>
                    <p className="text-sm text-muted-foreground">Institutions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">47</p>
                    <p className="text-sm text-muted-foreground">Sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="users">
            <TabsList className="mb-6">
              <TabsTrigger value="users" className="gap-2">
                <UserCog className="w-4 h-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="modules" className="gap-2">
                <Database className="w-4 h-4" />
                Modules
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="users">
              <UserManagement />
            </TabsContent>
            
            <TabsContent value="modules">
              <ModuleManagement />
            </TabsContent>
            
            <TabsContent value="settings">
              <SystemSettings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
