import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const AddAppointmentDialog = ({ onAppointmentAdded }: { onAppointmentAdded: () => void }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const doctor_name = formData.get("doctor_name") as string;
    const specialty = formData.get("specialty") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const location = formData.get("location") as string;
    const notes = formData.get("notes") as string;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const appointment_date = new Date(`${date}T${time}`).toISOString();

      const { error } = await supabase.from("appointments").insert({
        user_id: user.id,
        doctor_name,
        specialty: specialty || null,
        appointment_date,
        location: location || null,
        notes: notes || null,
      });

      if (error) throw error;

      toast({
        title: "Appointment Booked",
        description: "Your appointment has been scheduled successfully",
      });
      
      setOpen(false);
      e.currentTarget.reset();
      onAppointmentAdded();
    } catch (error) {
      console.error("Error adding appointment:", error);
      toast({
        title: "Error",
        description: "Failed to book appointment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Book Appointment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Doctor Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="doctor_name">Doctor's Name *</Label>
            <Input id="doctor_name" name="doctor_name" required />
          </div>
          <div>
            <Label htmlFor="specialty">Specialty</Label>
            <Input id="specialty" name="specialty" placeholder="e.g., Cardiologist, General Physician" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date *</Label>
              <Input id="date" name="date" type="date" required />
            </div>
            <div>
              <Label htmlFor="time">Time *</Label>
              <Input id="time" name="time" type="time" required />
            </div>
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" placeholder="Clinic or Hospital name" />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" placeholder="Any special instructions or symptoms to discuss" />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Booking..." : "Book Appointment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
