import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AppointmentCard } from "@/components/AppointmentCard";
import { AddAppointmentDialog } from "@/components/AddAppointmentDialog";
import { useToast } from "@/hooks/use-toast";

interface Appointment {
  id: string;
  doctor_name: string;
  specialty: string | null;
  appointment_date: string;
  location: string | null;
  notes: string | null;
  status: string;
}

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchAppointments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("user_id", user.id)
        .order("appointment_date", { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center gap-4 px-6 py-4">
          <Link to="/medicines">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Doctor Appointments</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-6">
          <AddAppointmentDialog onAppointmentAdded={fetchAppointments} />
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p className="text-center text-muted-foreground">No appointments scheduled. Book one to get started.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onDelete={fetchAppointments}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Appointments;
