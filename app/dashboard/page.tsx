"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useNotification } from "@/contexts/NotificationContext";
import ConfirmModal from "@/components/ConfirmModal";
import ScheduleModal from "@/components/ScheduleModal";
import Link from "next/link";

interface UserPreferences {
  categories: string[];
  frequency: string;
  email: string;
  is_active: boolean;
  created_at: string;
  send_time?: string;
}

export default function DashboardPage() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "pause" | "resume" | "send-now" | null
  >(null);
  const [isSending, setIsSending] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();

  // Consistent time formatting function to avoid hydration issues
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  // Consistent date formatting function to avoid hydration issues
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  useEffect(() => {
    fetch("/api/user-preferences")
      .then((response) => {
        if (response && response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        if (data) {
          setPreferences(data);
        }
      })
      .catch(() => {
        router.replace("/subscribe");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router]);

  const handleUpdatePreferences = () => {
    router.push("/select");
  };

  const handlePauseClick = () => {
    setPendingAction("pause");
    setShowConfirmModal(true);
  };

  const handleResumeClick = () => {
    setPendingAction("resume");
    setShowConfirmModal(true);
  };

  const handleSendNowClick = () => {
    setPendingAction("send-now");
    setShowConfirmModal(true);
  };

  const handleScheduleClick = () => {
    setShowScheduleModal(true);
  };

  const handleScheduleConfirm = async (scheduledTime: Date) => {
    setIsScheduling(true);
    try {
      const response = await fetch("/api/schedule-newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduledTime: scheduledTime.toISOString(),
        }),
      });

      if (response.ok) {
        const timeString = `${scheduledTime.getHours().toString().padStart(2, "0")}:${scheduledTime.getMinutes().toString().padStart(2, "0")}`;
        showSuccess(
          "Newsletter Scheduled",
          `Newsletter scheduled for ${formatDate(scheduledTime.toISOString())} at ${formatTime(timeString)}`
        );
      } else {
        const errorData = await response.json();
        showError(
          "Schedule Failed",
          errorData.error || "Failed to schedule newsletter"
        );
      }
    } catch (error) {
      console.error("Error scheduling newsletter:", error);
      showError("Schedule Failed", "Failed to schedule newsletter");
    } finally {
      setIsScheduling(false);
      setShowScheduleModal(false);
    }
  };

  const handleScheduleCancel = () => {
    setShowScheduleModal(false);
  };

  const handleConfirmAction = async () => {
    if (!user || !pendingAction) return;

    if (pendingAction === "send-now") {
      setIsSending(true);
      try {
        const response = await fetch("/api/send-newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          showSuccess(
            "Newsletter Sent",
            "Newsletter has been sent successfully"
          );
        } else {
          const errorData = await response.json();
          showError(
            "Send Failed",
            errorData.error || "Failed to send newsletter"
          );
        }
      } catch (error) {
        console.error("Error sending newsletter:", error);
        showError("Send Failed", "Failed to send newsletter");
      } finally {
        setIsSending(false);
        setShowConfirmModal(false);
        setPendingAction(null);
      }
      return;
    }

    const isActivating = pendingAction === "resume";

    try {
      const response = await fetch("/api/user-preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: isActivating }),
      });

      if (response.ok) {
        setPreferences((prev) =>
          prev ? { ...prev, is_active: isActivating } : null
        );
        if (isActivating) {
          showSuccess(
            "Newsletter Resumed",
            "Newsletter has been activated successfully"
          );
        } else {
          showSuccess(
            "Newsletter Paused",
            "Newsletter has been deactivated successfully"
          );
        }
      }
    } catch (error) {
      console.error(
        `Error ${isActivating ? "activating" : "deactivating"} newsletter:`,
        error
      );
      showError(
        "Action Failed",
        `Failed to ${isActivating ? "activate" : "deactivate"} newsletter`
      );
    } finally {
      setShowConfirmModal(false);
      setPendingAction(null);
    }
  };

  const handleCancelAction = () => {
    setShowConfirmModal(false);
    setPendingAction(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="w-16 h-16 border-4 border-black border-t-transparent animate-spin mx-auto mb-4"
            style={{ borderRadius: "0" }}
          ></div>
          <p className="text-[12px] text-black">LOADING DASHBOARD...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-[16px] text-black mb-4">NEWSLETTER DASHBOARD</h1>
          <p className="text-[12px] text-black">
            MANAGE YOUR AI-CURATED DIGEST
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card bg-white p-6">
            <h2 className="text-[14px] text-black mb-4">CURRENT SETTINGS</h2>

            {preferences ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-[12px] text-black mb-2">CATEGORIES</h3>
                  <div className="flex flex-wrap gap-2">
                    {preferences.categories.map((category) => (
                      <span
                        key={category}
                        className="px-3 py-1 bg-black text-white text-[10px] border-2 border-black"
                        style={{ fontFamily: "Press Start 2P" }}
                      >
                        {category.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[12px] text-black mb-2">FREQUENCY</h3>
                  <p className="text-[10px] text-black">
                    {preferences.frequency.toUpperCase()}
                  </p>
                </div>

                <div>
                  <h3 className="text-[12px] text-black mb-2">EMAIL</h3>
                  <p className="text-[10px] text-black">{preferences.email}</p>
                </div>

                <div>
                  <h3 className="text-[12px] text-black mb-2">SEND TIME</h3>
                  <p className="text-[10px] text-black">
                    {preferences.send_time
                      ? formatTime(preferences.send_time)
                      : "9:00 AM"}
                  </p>
                </div>

                <div>
                  <h3 className="text-[12px] text-black mb-2">STATUS</h3>
                  <div className="flex items-center">
                    <div
                      className={`w-3 h-3 mr-2 border-2 border-black ${
                        preferences.is_active ? "bg-black" : "bg-white"
                      }`}
                    ></div>
                    <span className="text-[10px] text-black">
                      {preferences.is_active ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-[12px] text-black mb-2">CREATED</h3>
                  <p className="text-[10px] text-black">
                    {formatDate(preferences.created_at)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-[10px] text-black mb-4">
                  NO PREFERENCES SET
                </p>
                <Link
                  href="/select"
                  className="inline-flex items-center px-4 py-2 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-all text-[10px] cursor-pointer"
                  style={{
                    fontFamily: "Press Start 2P",
                    boxShadow: "3px 3px 0px #000000",
                  }}
                >
                  SETUP NEWSLETTER
                </Link>
              </div>
            )}
          </div>

          <div className="card bg-white p-6">
            <h2 className="text-[14px] text-black mb-4">ACTIONS</h2>

            <div className="space-y-4">
              <button
                onClick={handleUpdatePreferences}
                className="w-full flex items-center justify-center px-4 py-3 border-2 border-black text-[10px] bg-white text-black hover:bg-black hover:text-white transition-all cursor-pointer"
                style={{
                  fontFamily: "Press Start 2P",
                  boxShadow: "3px 3px 0px #000000",
                }}
              >
                UPDATE PREFERENCES
              </button>

              {preferences && (
                <>
                  {preferences.is_active ? (
                    <button
                      onClick={handlePauseClick}
                      className="w-full flex items-center justify-center px-4 py-3 border-2 border-black text-[10px] bg-white text-black hover:bg-black hover:text-white transition-all cursor-pointer"
                      style={{
                        fontFamily: "Press Start 2P",
                        boxShadow: "3px 3px 0px #000000",
                      }}
                    >
                      PAUSE NEWSLETTER
                    </button>
                  ) : (
                    <button
                      onClick={handleResumeClick}
                      className="w-full flex items-center justify-center px-4 py-3 border-2 border-black text-[10px] bg-white text-black hover:bg-black hover:text-white transition-all cursor-pointer"
                      style={{
                        fontFamily: "Press Start 2P",
                        boxShadow: "3px 3px 0px #000000",
                      }}
                    >
                      RESUME NEWSLETTER
                    </button>
                  )}

                  <button
                    onClick={handleSendNowClick}
                    disabled={isSending}
                    className="w-full flex items-center justify-center px-4 py-3 border-2 border-black text-[10px] bg-white text-black hover:bg-black hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      fontFamily: "Press Start 2P",
                      boxShadow: "3px 3px 0px #000000",
                    }}
                  >
                    {isSending ? "SENDING..." : "SEND NOW"}
                  </button>

                  <button
                    onClick={handleScheduleClick}
                    disabled={isScheduling}
                    className="w-full flex items-center justify-center px-4 py-3 border-2 border-black text-[10px] bg-white text-black hover:bg-black hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      fontFamily: "Press Start 2P",
                      boxShadow: "3px 3px 0px #000000",
                    }}
                  >
                    {isScheduling ? "SCHEDULING..." : "SCHEDULE SEND"}
                  </button>
                </>
              )}

              <Link
                href="/select"
                className="w-full flex items-center justify-center px-4 py-3 border-2 border-black text-[10px] bg-white text-black hover:bg-black hover:text-white transition-all cursor-pointer"
                style={{
                  fontFamily: "Press Start 2P",
                  boxShadow: "3px 3px 0px #000000",
                }}
              >
                MANAGE SUBSCRIPTION
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 card bg-white p-6">
          <h3 className="text-[12px] text-black mb-2">HOW IT WORKS</h3>
          <ul className="text-[10px] text-black space-y-1">
            <li>{">"} NEWSLETTER AUTO-GENERATED FROM YOUR CATEGORIES</li>
            <li>{">"} DELIVERED AT YOUR SELECTED TIME BASED ON FREQUENCY</li>
            <li>{">"} PAUSE/RESUME ANYTIME</li>
            <li>{">"} SEND IMMEDIATELY WITH "SEND NOW" BUTTON</li>
            <li>{">"} SCHEDULE FOR SPECIFIC DATE/TIME</li>
            <li>{">"} UPDATE PREFERENCES TO CHANGE SETTINGS</li>
          </ul>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        title={
          pendingAction === "pause"
            ? "Pause Newsletter"
            : pendingAction === "resume"
              ? "Resume Newsletter"
              : "Send Newsletter Now"
        }
        message={
          pendingAction === "pause"
            ? "Are you sure you want to pause your newsletter? You won't receive any new newsletters until you resume."
            : pendingAction === "resume"
              ? "Are you sure you want to resume your newsletter? You'll start receiving newsletters according to your schedule."
              : "Are you sure you want to send a newsletter now? This will generate and send a newsletter with your current preferences immediately."
        }
        confirmText={
          pendingAction === "pause"
            ? "PAUSE"
            : pendingAction === "resume"
              ? "RESUME"
              : isSending
                ? "SENDING..."
                : "SEND NOW"
        }
        cancelText="CANCEL"
        type={pendingAction === "pause" ? "default" : "default"}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />

      <ScheduleModal
        isOpen={showScheduleModal}
        onClose={handleScheduleCancel}
        onConfirm={handleScheduleConfirm}
        isScheduling={isScheduling}
      />
    </div>
  );
}
