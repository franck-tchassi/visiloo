import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    

    return NextResponse.json({ success: true});
  } catch (error: any) {
    console.error("Erreur lors de l'envoi du SMS :", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
