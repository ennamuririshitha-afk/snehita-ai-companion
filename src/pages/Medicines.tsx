import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ArrowLeft, Plus, Pill, Clock, Calendar, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import MedicineCard from "@/components/MedicineCard";
import AddMedicineDialog from "@/components/AddMedicineDialog";
import { requestNotificationPermission, checkAndScheduleMedicineReminders } from "@/utils/notifications";

export type Medicine = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  start_date: string;
  end_date?: string;
  notes?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
};

const Medicines = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUser();
    fetchMedicines();
    
    // Request notification permission
    requestNotificationPermission().then((granted) => {
      if (granted) {
        toast({
          title: "Notifications Enabled",
          description: "You'll receive medicine reminders",
        });
      }
    });

    // Check for medicine reminders every minute
    const interval = setInterval(() => {
      if (medicines.length > 0) {
        checkAndScheduleMedicineReminders(medicines);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [medicines]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    }
  };

  const fetchMedicines = async () => {
    try {
      const { data, error } = await supabase
        .from("medicines")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMedicines(data || []);
      
      // Check and schedule notifications for medicines
      if (data) {
        checkAndScheduleMedicineReminders(data);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Couldn't load medicines",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">My Medicines</h1>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-xl text-muted-foreground">
              Loading your medicines...
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  Medicine Schedule
                </h2>
                <p className="mt-2 text-lg text-muted-foreground">
                  Manage your daily medications
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => setShowAddDialog(true)}
                className="gap-2"
              >
                <Plus className="h-5 w-5" />
                Add Medicine
              </Button>
            </div>

            <div className="mb-6 grid grid-cols-2 gap-4">
              <Link to="/emergency-contacts" className="w-full">
                <Button variant="secondary" className="w-full gap-2" size="lg">
                  <Shield className="h-5 w-5" />
                  Raksha
                </Button>
              </Link>
              <Link to="/appointments" className="w-full">
                <Button variant="secondary" className="w-full gap-2" size="lg">
                  <Calendar className="h-5 w-5" />
                  Appointments
                </Button>
              </Link>
            </div>

            {medicines.length === 0 ? (
              <Card className="p-12 text-center">
                <Pill className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                <h3 className="mb-2 text-2xl font-bold text-foreground">
                  No medicines yet
                </h3>
                <p className="mb-6 text-lg text-muted-foreground">
                  Add your first medicine to start tracking
                </p>
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="mr-2 h-5 w-5" />
                  Add Medicine
                </Button>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {medicines.map((medicine) => (
                  <MedicineCard
                    key={medicine.id}
                    medicine={medicine}
                    onUpdate={fetchMedicines}
                  />
                ))}
              </div>
            )}

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <Card className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Daily Reminders</h3>
                </div>
                <p className="text-muted-foreground">
                  Get voice notifications when it's time to take your medicine
                </p>
              </Card>

              <Card className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-full bg-accent/10 p-3">
                    <Calendar className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold">Track History</h3>
                </div>
                <p className="text-muted-foreground">
                  See your medicine intake history and stay on schedule
                </p>
              </Card>

              <Card className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-full bg-secondary/10 p-3">
                    <Pill className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-xl font-bold">Voice Control</h3>
                </div>
                <p className="text-muted-foreground">
                  Use voice commands in chat to manage your medicines
                </p>
              </Card>
            </div>
          </>
        )}
      </div>

      <AddMedicineDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={fetchMedicines}
      />
    </div>
  );
};

export default Medicines;
