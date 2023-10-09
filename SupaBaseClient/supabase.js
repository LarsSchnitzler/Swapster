console.log("Initialisierung Supabase");

// Supabase Initialisierung
const supabaseUrl = 'https://acpwquakwwmyxwyadtxl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjcHdxdWFrd3dteXh3eWFkdHhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYzMTk3NTYsImV4cCI6MjAxMTg5NTc1Nn0.jDiMGKlldaIc-33ZGuD2BdMfzCCLoBCnBaagumhkxSA'
const supa = supabase.createClient(supabaseUrl, supabaseKey, {
    auth: {
        redirectTo: window.location.origin,  // This will redirect back to the page where the request originated from
    },
});

export { supa }