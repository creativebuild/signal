import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode") === "dark" ? "dark" : "light";
    const filename = mode === "dark" ? "dark.json" : "light.json";
    const filePath = path.join(process.cwd(), "tokens", filename);
    const content = await readFile(filePath, "utf-8");
    return new NextResponse(content, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "Figma tokens not found. Run npm run tokens to generate tokens/light.json and tokens/dark.json.",
      },
      { status: 404 }
    );
  }
}
