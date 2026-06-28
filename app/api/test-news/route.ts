import { NextRequest, NextResponse } from "next/server";
import { fetchArticles } from "@/lib/news";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const categoriesParam = url.searchParams.get("categories");

    // Default categories or from query param
    const categories = categoriesParam
      ? categoriesParam.split(",").map((c) => c.trim())
      : ["technology", "sports", "science", "business"];

    console.log("Testing news fetch with categories:", categories);

    const articles = await fetchArticles(categories);

    const summary = {
      totalArticles: articles.length,
      categories: categories,
      breakdown: categories.map((cat) => ({
        category: cat,
        count: articles.filter((a) => a.category === cat).length,
      })),
      sampleArticles: articles.slice(0, 10).map((a) => ({
        title: a.title,
        category: a.category,
        description: a.description?.substring(0, 100) + "...",
      })),
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Test news API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
