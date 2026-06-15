import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateNewsletterSummary(
  articles: any[],
  categories: string[]
) {
  console.log(
    `Generating newsletter for ${articles.length} articles in categories: ${categories.join(", ")}`
  );

  if (!articles || articles.length === 0) {
    console.error("No articles provided to generate newsletter");
    return `<h3>Top Stories</h3><p>No articles available today for: ${categories
      .map((c) => c)
      .join(", ")}</p>`;
  }

  if (!process.env.GROQ_API_KEY) {
    console.error("GROQ_API_KEY is not set in environment variables");
    return generateFallbackNewsletter(articles, categories);
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are InboxAI, a concise newsletter formatter. Output minimal HTML only. Do NOT include greetings, sign-offs (e.g., "Best regards"), disclaimers, placeholders (e.g., [insert ...]), or unsubscribe/CTA language. No emojis. Do not mention your name in the output. Group stories by category; each item has a linked title followed by a brief 1–2 sentence paragraph.`,
        },
        {
          role: "user",
          content: `Format these ${categories.join(", ")} news items as minimal HTML with a title link and a brief paragraph under each.

STRICT RULES:
- HTML only, no prose outside the structure
- Allowed tags: <h3>, <ul>, <li>, <a>, <p>
- Group by category (${categories.join(", ")})
- Each item structure:
  <li>
    <a href="SOURCE">TITLE</a>
    <p>Brief 1–2 sentence summary in English.</p>
  </li>
- No intros or conclusions
- No greetings, signatures (e.g., "Best regards"), disclaimers, placeholders, or unsubscribe text
- English-only content

ARTICLES:
${articles
  .map(
    (article: any, idx: number) =>
      `${idx + 1}. CATEGORY: ${article.category || "general"}
TITLE: ${article.title}
URL: ${article.url}
---`
  )
  .join("\n")}

OUTPUT SHAPE EXAMPLE (use this structure, no extra text):
<h3>CATEGORY NAME</h3>
<ul>
  <li>
    <a href="https://example.com">Story title</a>
    <p>One short paragraph describing what’s new and why it matters.</p>
  </li>
</ul>`,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 2000,
    });

    const result = completion.choices[0]?.message?.content;
    if (!result || result.trim().length === 0) {
      console.error("Groq API returned empty content");
      return generateFallbackNewsletter(articles, categories);
    }

    console.log("Successfully generated newsletter with Groq AI");
    return result;
  } catch (error) {
    console.error("Groq API error:", error);
    return generateFallbackNewsletter(articles, categories);
  }
}

function generateFallbackNewsletter(articles: any[], categories: string[]) {
  console.log("Using fallback newsletter generation");
  console.log(
    `Fallback: ${articles.length} articles across ${categories.length} categories`
  );

  const articlesByCategory: { [key: string]: any[] } = {};
  categories.forEach((cat) => (articlesByCategory[cat] = []));

  articles.forEach((article) => {
    if (articlesByCategory[article.category]) {
      articlesByCategory[article.category].push(article);
    }
  });

  console.log(
    "Fallback articles by category:",
    categories
      .map((cat) => `${cat}: ${articlesByCategory[cat].length}`)
      .join(", ")
  );

  let content = ``;

  let articleCount = 0;
  categories.forEach((category) => {
    const categoryArticles = articlesByCategory[category];
    if (categoryArticles.length > 0) {
      content += `\n<h3>${category}</h3>\n<ul>`;
      categoryArticles.slice(0, 3).forEach((article: any) => {
        articleCount++;
        const safeTitle = (article.title || "Untitled")
          .toString()
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        const safeDesc = (article.description || "")
          .toString()
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        content += `\n  <li>\n    <a href="${article.url}" target="_blank" rel="noopener noreferrer">${safeTitle}</a>\n    <p>${safeDesc}</p>\n  </li>`;
      });
      content += `\n</ul>`;
    }
  });

  return content;
}

export { groq };
