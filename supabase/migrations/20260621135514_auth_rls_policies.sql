-- Allow authenticated users to insert, update, delete records in all tables

-- Events
CREATE POLICY "Authenticated users can insert events" ON public.events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update events" ON public.events FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete events" ON public.events FOR DELETE USING (auth.role() = 'authenticated');

-- Announcements
CREATE POLICY "Authenticated users can insert announcements" ON public.announcements FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update announcements" ON public.announcements FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete announcements" ON public.announcements FOR DELETE USING (auth.role() = 'authenticated');

-- Achievements
CREATE POLICY "Authenticated users can insert achievements" ON public.achievements FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update achievements" ON public.achievements FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete achievements" ON public.achievements FOR DELETE USING (auth.role() = 'authenticated');

-- Members
CREATE POLICY "Authenticated users can insert members" ON public.members FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update members" ON public.members FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete members" ON public.members FOR DELETE USING (auth.role() = 'authenticated');

-- Storage Bucket Policies
-- Posters
CREATE POLICY "Authenticated users can insert posters" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'posters' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update posters" ON storage.objects FOR UPDATE USING (bucket_id = 'posters' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete posters" ON storage.objects FOR DELETE USING (bucket_id = 'posters' AND auth.role() = 'authenticated');

-- Profiles
CREATE POLICY "Authenticated users can insert profiles" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profiles' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update profiles" ON storage.objects FOR UPDATE USING (bucket_id = 'profiles' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete profiles" ON storage.objects FOR DELETE USING (bucket_id = 'profiles' AND auth.role() = 'authenticated');
