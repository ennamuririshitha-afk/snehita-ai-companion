import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, X } from "lucide-react";

type AddMedicineDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

const AddMedicineDialog = ({ open, onOpenChange, onSuccess }: AddMedicineDialogProps) => {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [times, setTimes] = useState<string[]>(["08:00"]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAddTime = () => {
    setTimes([...times, "12:00"]);
  };

  const handleRemoveTime = (index: number) => {
    setTimes(times.filter((_, i) => i !== index));
  };

  const handleTimeChange = (index: number, value: string) => {
    const newTimes = [...times];
    newTimes[index] = value;
    setTimes(newTimes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("medicines").insert({
        user_id: user.id,
        name,
        dosage,
        frequency,
        times,
        start_date: startDate,
        notes: notes || null,
        active: true,
      });

      if (error) throw error;

      toast({
        title: "Medicine added!",
        description: `${name} has been added to your schedule.`,
      });

      // Reset form
      setName("");
      setDosage("");
      setFrequency("");
      setTimes(["08:00"]);
      setStartDate(new Date().toISOString().split("T")[0]);
      setNotes("");
      
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Medicine</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-lg">Medicine Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g., Aspirin"
              className="h-12 text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dosage" className="text-lg">Dosage</Label>
            <Input
              id="dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              required
              placeholder="e.g., 100mg"
              className="h-12 text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency" className="text-lg">Frequency</Label>
            <Input
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              required
              placeholder="e.g., Once daily, Twice daily"
              className="h-12 text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-lg">Times</Label>
            {times.map((time, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => handleTimeChange(index, e.target.value)}
                  required
                  className="h-12 text-lg"
                />
                {times.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveTime(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddTime}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Time
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-lg">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="h-12 text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-lg">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special instructions..."
              className="min-h-[100px] text-lg"
            />
          </div>

          <Button type="submit" className="h-12 w-full text-lg" disabled={loading}>
            {loading ? "Adding..." : "Add Medicine"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicineDialog;
