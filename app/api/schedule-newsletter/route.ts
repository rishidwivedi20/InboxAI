import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/server";
import { inngest } from "@/lib/inngest/client";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Get the user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in to schedule a newsletter." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { scheduledTime } = body;

    if (!scheduledTime) {
      return NextResponse.json(
        { error: "Scheduled time is required." },
        { status: 400 }
      );
    }

    const scheduleDate = new Date(scheduledTime);
    const now = new Date();

    if (scheduleDate <= now) {
      return NextResponse.json(
        { error: "Scheduled time must be in the future." },
        { status: 400 }
      );
    }

    // Get user preferences
    const { data: preferences, error } = await supabase
      .from("user_preferences")
      .select("categories, frequency, email, is_active")
      .eq("user_id", user.id)
      .single();

    if (error || !preferences) {
      return NextResponse.json(
        {
          error:
            "User preferences not found. Please set up your newsletter first.",
        },
        { status: 404 }
      );
    }

    if (!preferences.is_active) {
      return NextResponse.json(
        { error: "Newsletter is currently paused. Please resume it first." },
        { status: 400 }
      );
    }

    // Send scheduled newsletter event to Inngest
    const { ids } = await inngest.send({
      name: "newsletter.schedule",
      data: {
        userId: user.id,
        email: preferences.email,
        categories: preferences.categories,
        frequency: preferences.frequency,
        isScheduled: true,
        scheduledFor: scheduledTime,
      },
      ts: scheduleDate.getTime(),
    });

    return NextResponse.json({
      success: true,
      message: "Newsletter scheduled successfully",
      eventId: ids[0],
      scheduledFor: scheduledTime,
    });
  } catch (error) {
    console.error("Error in schedule-newsletter API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
