-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone_number TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create medicines table
CREATE TABLE public.medicines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL, -- e.g., "Once daily", "Twice daily", "Every 6 hours"
  times TEXT[] NOT NULL, -- Array of times like ["08:00", "20:00"]
  start_date DATE NOT NULL,
  end_date DATE,
  notes TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on medicines
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;

-- Medicines policies
CREATE POLICY "Users can view their own medicines"
  ON public.medicines FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own medicines"
  ON public.medicines FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own medicines"
  ON public.medicines FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own medicines"
  ON public.medicines FOR DELETE
  USING (auth.uid() = user_id);

-- Create medicine intake history table
CREATE TABLE public.medicine_intakes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  medicine_id UUID NOT NULL REFERENCES public.medicines(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  taken_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'taken', 'missed', 'skipped'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on medicine intakes
ALTER TABLE public.medicine_intakes ENABLE ROW LEVEL SECURITY;

-- Medicine intakes policies
CREATE POLICY "Users can view their own intakes"
  ON public.medicine_intakes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own intakes"
  ON public.medicine_intakes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own intakes"
  ON public.medicine_intakes FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_medicines
  BEFORE UPDATE ON public.medicines
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_medicines_user_id ON public.medicines(user_id);
CREATE INDEX idx_medicines_active ON public.medicines(active);
CREATE INDEX idx_medicine_intakes_user_id ON public.medicine_intakes(user_id);
CREATE INDEX idx_medicine_intakes_medicine_id ON public.medicine_intakes(medicine_id);
CREATE INDEX idx_medicine_intakes_status ON public.medicine_intakes(status);
CREATE INDEX idx_medicine_intakes_scheduled_time ON public.medicine_intakes(scheduled_time);