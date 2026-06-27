import { inngest } from "../client";
import { fetchArticles } from "@/lib/news";
import { generateNewsletterSummary } from "@/lib/groq-client";
import { marked } from "marked";
import { sendEmail } from "@/lib/email";
import { createClient } from "@/lib/server";

export const scheduledNewsletterFunction = inngest.createFunction(
  { id: "newsletter/scheduled" },
  { event: "newsletter.schedule" },
  async ({ event, step, runId }) => {
    if (!event.data.isImmediate && !event.data.isScheduled) {
      const isUserActive = await step.run("check-user-status", async () => {
        const supabase = await createClient();

        const { data: preferences, error } = await supabase
          .from("user_preferences")
          .select("is_active")
          .eq("user_id", event.data.userId)
          .single();

        if (error || !preferences) {
          console.log(
            `User preferences not found for user ${event.data.userId}`
          );
          return false;
        }

        if (!preferences.is_active) {
          console.log(
            `User ${event.data.userId} has paused their newsletter. Skipping send.`
          );
          return false;
        }

        return true;
      });

      if (!isUserActive) {
        console.log(
          "Newsletter cancelled - user is inactive or preferences not found"
        );
        return {
          cancelled: true,
          reason: "User inactive or preferences not found",
        };
      }
    }

    const categories = event.data.categories;

    const allArticles = await step.run("fetch-news", async () => {
      return fetchArticles(categories);
    });

    const summary = await step.run("generate-summary", async () => {
      return await generateNewsletterSummary(allArticles, categories);
    });

    const processedNewsletter = await step.run(
      "process-newsletter",
      async () => {
        console.log("Raw summary:", summary);
        console.log(
          `Articles breakdown by category:`,
          categories
            .map(
              (cat: string) =>
                `${cat}: ${allArticles.filter((a) => a.category === cat).length}`
            )
            .join(", ")
        );

        const newsletterContent = summary;

        if (!newsletterContent) {
          throw new Error("Failed to generate newsletter content");
        }

        const htmlResult = await marked(newsletterContent);

        return {
          content: newsletterContent,
          html: htmlResult,
          categories: categories,
          articleCount: allArticles.length,
          categoryBreakdown: categories.map((cat: string) => ({
            category: cat,
            count: allArticles.filter((a) => a.category === cat).length,
          })),
        };
      }
    );

    await step.run("send-email", async () => {
      try {
        await sendEmail(
          event.data.email,
          event.data.categories.join(", "),
          allArticles.length,
          processedNewsletter.html
        );

        const sendType = event.data.isImmediate
          ? "(immediate)"
          : event.data.isScheduled
            ? "(scheduled)"
            : "(regular)";
        console.log(
          `Newsletter sent successfully to ${event.data.email} ${sendType}`
        );
      } catch (error) {
        console.error("Error sending email:", error);
        console.error("Email data:", {
          email: event.data.email,
          categories: event.data.categories,
          articleCount: allArticles.length,
          htmlLength: processedNewsletter.html?.length || 0,
        });
        throw error;
      }
    });

    // Schedule next newsletter if this was a regular scheduled send (not immediate or one-time scheduled)
    if (
      !event.data.isImmediate &&
      !event.data.isScheduled &&
      event.data.frequency
    ) {
      await step.run("schedule-next", async () => {
        const supabase = await createClient();

        // Get user preferences for send time
        const { data: preferences, error } = await supabase
          .from("user_preferences")
          .select("send_time")
          .eq("user_id", event.data.userId)
          .single();

        const sendTime = preferences?.send_time || "09:00";
        const [sendHour, sendMinute] = sendTime.split(":").map(Number);

        // Calculate next schedule time
        const now = new Date();
        let nextScheduleTime: Date;

        switch (event.data.frequency) {
          case "daily":
            nextScheduleTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            break;
          case "weekly":
            nextScheduleTime = new Date(
              now.getTime() + 7 * 24 * 60 * 60 * 1000
            );
            break;
          case "biweekly":
            nextScheduleTime = new Date(
              now.getTime() + 14 * 24 * 60 * 60 * 1000
            );
            break;
          default:
            nextScheduleTime = new Date(
              now.getTime() + 7 * 24 * 60 * 60 * 1000
            );
        }

        nextScheduleTime.setHours(sendHour, sendMinute, 0, 0);

        // Schedule the next newsletter
        await inngest.send({
          name: "newsletter.schedule",
          data: {
            userId: event.data.userId,
            email: event.data.email,
            categories: event.data.categories,
            frequency: event.data.frequency,
          },
          ts: nextScheduleTime.getTime(),
        });

        console.log(
          `Next newsletter scheduled for ${nextScheduleTime.toISOString()}`
        );
      });
    }

    return {
      success: true,
      emailSent: true,
      isImmediate: event.data.isImmediate || false,
      isScheduled: event.data.isScheduled || false,
      articleCount: allArticles.length,
      categories: categories,
    };
  }
);
