import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pill, Clock, Calendar, Trash2, CheckCircle } from "lucide-react";
import { Medicine } from "@/pages/Medicines";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type MedicineCardProps = {
  medicine: Medicine;
  onUpdate: () => void;
};

const MedicineCard = ({ medicine, onUpdate }: MedicineCardProps) => {
  const { toast } = useToast();

  const handleMarkTaken = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("medicine_intakes").insert({
        medicine_id: medicine.id,
        user_id: user.id,
        scheduled_time: new Date().toISOString(),
        taken_at: new Date().toISOString(),
        status: "taken",
      });

      if (error) throw error;

      toast({
        title: "Medicine taken!",
        description: `You've marked ${medicine.name} as taken.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("medicines")
        .update({ active: false })
        .eq("id", medicine.id);

      if (error) throw error;

      toast({
        title: "Medicine removed",
        description: `${medicine.name} has been removed from your list.`,
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6 transition-all hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Pill className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {medicine.name}
            </h3>
            <p className="text-sm text-muted-foreground">{medicine.dosage}</p>
          </div>
        </div>
        <Badge variant="secondary">{medicine.frequency}</Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Times: {medicine.times.join(", ")}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>
            Started: {format(new Date(medicine.start_date), "MMM dd, yyyy")}
          </span>
        </div>

        {medicine.notes && (
          <p className="text-sm text-muted-foreground">{medicine.notes}</p>
        )}
      </div>

      <div className="mt-6 flex gap-2">
        <Button
          className="flex-1 gap-2"
          onClick={handleMarkTaken}
        >
          <CheckCircle className="h-4 w-4" />
          Mark Taken
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default MedicineCard;
