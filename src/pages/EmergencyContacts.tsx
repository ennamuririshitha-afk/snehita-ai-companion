import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { EmergencyContactCard } from "@/components/EmergencyContactCard";
import { AddEmergencyContactDialog } from "@/components/AddEmergencyContactDialog";
import { useToast } from "@/hooks/use-toast";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string | null;
}

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchContacts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("emergency_contacts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast({
        title: "Error",
        description: "Failed to load emergency contacts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
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
          <h1 className="text-2xl font-bold text-foreground">Emergency Contacts</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-6">
          <AddEmergencyContactDialog onContactAdded={fetchContacts} />
        </div>

        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading contacts...</p>
        ) : contacts.length === 0 ? (
          <p className="text-center text-muted-foreground">No emergency contacts yet. Add one to get started.</p>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <EmergencyContactCard
                key={contact.id}
                contact={contact}
                onDelete={fetchContacts}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default EmergencyContacts;
