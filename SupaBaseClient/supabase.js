const supabaseUrl = 'https://wovrufcmlvwhuegcwcif.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvdnJ1ZmNtbHZ3aHVlZ2N3Y2lmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYzMTc1NDcsImV4cCI6MjAxMTg5MzU0N30.MHFk-sNmqdczSlzV1NTPwi-hvueZdfr8fOljpsxOtxo'
const supa = supabase.createClient(supabaseUrl, supabaseKey, {
    auth: {
        redirectTo: window.location.origin,
    },
});

console.log("Initialisierung Supabase erfolgreich");

export { supa }