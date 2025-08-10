import { NextResponse } from "next/server";
import { z } from "zod";
import { adminDb } from "@/lib/firebase/admin";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  message: z.string().min(1),
  interest: z.string().optional().default("general"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    // Save to Firestore
    await adminDb.collection("leads").add({
      ...data,
      createdAt: Date.now(),
      status: "new",
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Contact form error:", err);
    const msg = err?.message || "Invalid request";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}


