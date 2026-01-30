import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface GeneratedLesson {
  id: string;
  category: string;
  contentRu: string;
  contentEn: string;
  level: number;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  notes?: string;
}

export default function AdminReview() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<GeneratedLesson[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [editNotes, setEditNotes] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch lessons
  const { data: lessonsData } = trpc.admin.getGeneratedLessons.useQuery(
    { status: filter },
    { enabled: user?.role === "admin" }
  );

  // Mutations
  const approveMutation = trpc.admin.approveLesson.useMutation({
    onSuccess: () => {
      toast.success("Leçon approuvée ✓");
      handleNext();
    },
  });

  const rejectMutation = trpc.admin.rejectLesson.useMutation({
    onSuccess: () => {
      toast.error("Leçon rejetée ✗");
      handleNext();
    },
  });

  const updateNotesMutation = trpc.admin.updateLessonNotes.useMutation({
    onSuccess: () => {
      toast.success("Notes mises à jour");
    },
  });

  useEffect(() => {
    if (lessonsData) {
      setLessons(lessonsData);
      setCurrentIndex(0);
      setIsLoading(false);
    }
  }, [lessonsData, filter]);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-bold mb-2">Accès refusé</h2>
          <p className="text-muted-foreground">Vous n'avez pas les permissions d'administrateur</p>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin">⏳</div>
      </div>
    );
  }

  const currentLesson = lessons[currentIndex];

  if (!currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500" />
          <h2 className="text-xl font-bold mb-2">Aucune leçon à réviser</h2>
          <p className="text-muted-foreground mb-4">
            {filter === "pending" ? "Toutes les leçons en attente ont été traitées !" : "Aucune leçon trouvée"}
          </p>
          <Button onClick={() => setFilter("pending")}>Retour aux leçons en attente</Button>
        </Card>
      </div>
    );
  }

  const handleApprove = () => {
    approveMutation.mutate({ lessonId: currentLesson.id });
  };

  const handleReject = () => {
    rejectMutation.mutate({ lessonId: currentLesson.id });
  };

  const handleUpdateNotes = () => {
    updateNotesMutation.mutate({ lessonId: currentLesson.id, notes: editNotes });
  };

  const handleNext = () => {
    if (currentIndex < lessons.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setEditNotes("");
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setEditNotes(currentLesson.notes || "");
    }
  };

  const statusColor = {
    pending: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
    approved: "bg-green-500/10 text-green-700 border-green-200",
    rejected: "bg-red-500/10 text-red-700 border-red-200",
  };

  const levelColor = {
    1: "bg-red-500/10 text-red-700",
    2: "bg-orange-500/10 text-orange-700",
    3: "bg-yellow-500/10 text-yellow-700",
    4: "bg-blue-500/10 text-blue-700",
    5: "bg-purple-500/10 text-purple-700",
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Révision du Contenu Généré</h1>
          <p className="text-muted-foreground">
            Approuvez ou rejetez les leçons générées automatiquement
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex gap-4 mb-6">
          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="approved">Approuvés</SelectItem>
              <SelectItem value="rejected">Rejetés</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex-1 text-right text-sm text-muted-foreground">
            {currentIndex + 1} / {lessons.length}
          </div>
        </div>

        {/* Main Content Card */}
        <Card className="p-8 mb-6 border-2 border-border">
          {/* Status Badge */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-2">
              <Badge className={statusColor[currentLesson.status]}>
                {currentLesson.status === "pending" && "⏳ En attente"}
                {currentLesson.status === "approved" && "✓ Approuvé"}
                {currentLesson.status === "rejected" && "✗ Rejeté"}
              </Badge>
              <Badge variant="outline" className={levelColor[currentLesson.level as keyof typeof levelColor]}>
                Niveau {currentLesson.level}
              </Badge>
              <Badge variant="secondary">{currentLesson.category}</Badge>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(currentLesson.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Russian Content */}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground">РУССКИЙ ТЕКСТ</h3>
              <div className="bg-secondary/50 p-4 rounded-lg border border-border">
                <p className="text-lg font-serif text-foreground">{currentLesson.contentRu}</p>
              </div>
            </div>

            {/* English Translation */}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground">ENGLISH TRANSLATION</h3>
              <div className="bg-secondary/50 p-4 rounded-lg border border-border">
                <p className="text-base text-foreground">{currentLesson.contentEn}</p>
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground">NOTES D'ÉDITION</h3>
              <Textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Ajoutez vos notes ou corrections..."
                className="min-h-24"
              />
              <Button
                onClick={handleUpdateNotes}
                variant="outline"
                size="sm"
                className="mt-2"
                disabled={updateNotesMutation.isPending}
              >
                {updateNotesMutation.isPending ? "Mise à jour..." : "Mettre à jour les notes"}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-border">
            <Button
              onClick={handleApprove}
              disabled={approveMutation.isPending || currentLesson.status !== "pending"}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {approveMutation.isPending ? "Approbation..." : "Approuver"}
            </Button>
            <Button
              onClick={handleReject}
              disabled={rejectMutation.isPending || currentLesson.status !== "pending"}
              variant="destructive"
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-2" />
              {rejectMutation.isPending ? "Rejet..." : "Rejeter"}
            </Button>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4 justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="outline"
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Précédent
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentIndex === lessons.length - 1}
            variant="outline"
            className="flex-1"
          >
            Suivant
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Statistics */}
        <Card className="mt-8 p-6 bg-secondary/50">
          <h3 className="font-semibold mb-4">Statistiques</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {lessons.filter((l) => l.status === "pending").length}
              </div>
              <div className="text-sm text-muted-foreground">En attente</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {lessons.filter((l) => l.status === "approved").length}
              </div>
              <div className="text-sm text-muted-foreground">Approuvés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {lessons.filter((l) => l.status === "rejected").length}
              </div>
              <div className="text-sm text-muted-foreground">Rejetés</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
