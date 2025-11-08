import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Activity, Heart, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import aarogyamHero from "@/assets/aarogyam-hero.jpg";
import rakshaHero from "@/assets/raksha-hero.jpg";
import snehamHero from "@/assets/sneham-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="h-10 w-10 text-primary" />
              <h1 className="text-3xl font-bold text-foreground">Lovable AI</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h2 className="mb-6 text-5xl font-bold text-foreground">
          Your Caring Companion
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-xl text-muted-foreground">
          Always here to help with your health, safety, and emotional well-being.
          Speak naturally, and I'll understand.
        </p>
        <Link to="/chat">
          <Button size="lg" className="text-lg px-8 py-6 rounded-full">
            Start Talking with Me
          </Button>
        </Link>
      </section>

      {/* Three Modules */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Aarogyam - Health Module */}
          <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={aarogyamHero} 
                alt="Health and Medicine Management" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <Activity className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Aarogyam</h3>
              </div>
              <p className="mb-6 text-lg text-muted-foreground">
                Your health companion. I'll remind you about medicines, track appointments, 
                and help you stay healthy every day.
              </p>
              <ul className="space-y-3 text-left text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                  <span>Medicine reminders with voice alerts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                  <span>Doctor appointment scheduling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary"></span>
                  <span>Health tips and guidance</span>
                </li>
              </ul>
            </div>
          </Card>

          {/* Raksha - Emergency Module */}
          <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={rakshaHero} 
                alt="Emergency Alert System" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-secondary/10 p-3">
                  <Shield className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Raksha</h3>
              </div>
              <p className="mb-6 text-lg text-muted-foreground">
                Your safety guardian. One word and I'll alert your family immediately. 
                You're never alone in an emergency.
              </p>
              <ul className="space-y-3 text-left text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-secondary"></span>
                  <span>Instant SOS alerts to family</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-secondary"></span>
                  <span>Location sharing when needed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-secondary"></span>
                  <span>24/7 emergency assistance</span>
                </li>
              </ul>
            </div>
          </Card>

          {/* Sneham - Emotional Module */}
          <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={snehamHero} 
                alt="Emotional Support Companion" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-full bg-accent/10 p-3">
                  <Heart className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Sneham</h3>
              </div>
              <p className="mb-6 text-lg text-muted-foreground">
                Your emotional friend. Talk to me about anything. I'm here to listen, 
                comfort, and keep you company always.
              </p>
              <ul className="space-y-3 text-left text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-accent"></span>
                  <span>Warm conversation anytime</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-accent"></span>
                  <span>Emotional support and comfort</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-accent"></span>
                  <span>Remembers your preferences</span>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 p-12">
          <h2 className="mb-4 text-4xl font-bold text-foreground">
            Ready to Chat?
          </h2>
          <p className="mb-8 text-xl text-muted-foreground">
            I speak Telugu, Tamil, and English. Just talk to me like you would to family.
          </p>
          <Link to="/chat">
            <Button size="lg" className="text-lg px-8 py-6 rounded-full">
              Start Conversation
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p>Made with ❤️ for our beloved elders</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
