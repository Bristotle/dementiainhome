import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { first_name, last_name, email, phone, city, state, message } = body
    if (!first_name || !last_name || !email || !phone) {
      return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 })
    }
    const { error } = await supabase.from("leads").insert([{ first_name, last_name, email, phone, city, state, message }])
    if (error) { console.error("Supabase error:", error); return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 }) }
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) { console.error("API error:", err); return NextResponse.json({ error: "Something went wrong." }, { status: 500 }) }
}
