import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Trash2, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string | null;
}

interface EmergencyContactCardProps {
  contact: EmergencyContact;
  onDelete: () => void;
}

export const EmergencyContactCard = ({ contact, onDelete }: EmergencyContactCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("emergency_contacts")
        .delete()
        .eq("id", contact.id);

      if (error) throw error;

      toast({
        title: "Contact Deleted",
        description: "Emergency contact removed successfully",
      });
      onDelete();
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast({
        title: "Error",
        description: "Failed to delete contact",
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
          <h3 className="font-semibold text-lg">{contact.name}</h3>
          {contact.relationship && (
            <p className="text-sm text-muted-foreground">{contact.relationship}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Phone className="h-4 w-4 text-primary" />
            <a href={`tel:${contact.phone}`} className="text-sm hover:underline">
              {contact.phone}
            </a>
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
