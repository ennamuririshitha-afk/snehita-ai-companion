import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { EmergencyContactCard } from "@/components/EmergencyContactCard";
import { AddEmergencyContactDialog } from "@/components/AddEmergencyContactDialog";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

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
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Raksha</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-6">
          <Card className="p-4 bg-destructive/10 border-destructive/20">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-destructive">Emergency Ambulance</h3>
                <p className="text-sm text-muted-foreground">National Emergency Number</p>
                <div className="flex items-center gap-2 mt-2">
                  <Shield className="h-4 w-4 text-destructive" />
                  <a href="tel:108" className="text-lg font-bold text-destructive hover:underline">
                    108
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </div>

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
