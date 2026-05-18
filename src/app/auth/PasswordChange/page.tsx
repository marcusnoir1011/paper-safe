"use client";

import { supabase } from "@/lib/client";

// this page have to return a jsx that would show the user password update or change web page

await supabase.auth.updateUser({ password: "new_password" });
