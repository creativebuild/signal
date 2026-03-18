import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "tokens", "variables-pro.json");
    const content = await readFile(filePath, "utf-8");
    return new NextResponse(content, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": 'attachment; filename="variables-pro.json"',
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Tokens file not found. Run npm run tokens first." },
      { status: 404 }
    );
  }
}
