-- Enable RLS for all tables
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Public READ policies
CREATE POLICY "Public read access for members"
ON public.members FOR SELECT USING (true);

CREATE POLICY "Public read access for published events"
ON public.events FOR SELECT USING (is_published = true);

CREATE POLICY "Public read access for published announcements"
ON public.announcements FOR SELECT USING (is_published = true);

CREATE POLICY "Public read access for achievements"
ON public.achievements FOR SELECT USING (true);

-- Create Storage Buckets (requires inserting into storage.buckets)
INSERT INTO storage.buckets (id, name, public) VALUES ('posters', 'posters', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('profiles', 'profiles', true);

-- Storage RLS policies (Public READ)
CREATE POLICY "Public read access for posters bucket"
ON storage.objects FOR SELECT USING (bucket_id = 'posters');

CREATE POLICY "Public read access for profiles bucket"
ON storage.objects FOR SELECT USING (bucket_id = 'profiles');
