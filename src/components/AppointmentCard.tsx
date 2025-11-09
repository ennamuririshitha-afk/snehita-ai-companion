import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Trash2, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Appointment {
  id: string;
  doctor_name: string;
  specialty: string | null;
  appointment_date: string;
  location: string | null;
  notes: string | null;
  status: string;
}

interface AppointmentCardProps {
  appointment: Appointment;
  onDelete: () => void;
}

export const AppointmentCard = ({ appointment, onDelete }: AppointmentCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", appointment.id);

      if (error) throw error;

      toast({
        title: "Appointment Cancelled",
        description: "Appointment removed successfully",
      });
      onDelete();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{appointment.doctor_name}</h3>
          {appointment.specialty && (
            <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
          )}
          <div className="space-y-2 mt-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm">
                {format(new Date(appointment.appointment_date), "PPP")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm">
                {format(new Date(appointment.appointment_date), "p")}
              </span>
            </div>
            {appointment.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm">{appointment.location}</span>
              </div>
            )}
            {appointment.notes && (
              <p className="text-sm text-muted-foreground mt-2">{appointment.notes}</p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </Card>
  );
};
