import { useState } from "react";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (scheduledTime: Date) => void;
  isScheduling?: boolean;
}

export default function ScheduleModal({
  isOpen,
  onClose,
  onConfirm,
  isScheduling = false,
}: ScheduleModalProps) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [selectedTime, setSelectedTime] = useState("09:00");

  const handleConfirm = () => {
    const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`);
    onConfirm(scheduledDateTime);
  };

  if (!isOpen) return null;

  const timeOptions = [];
  for (let hour = 6; hour <= 23; hour++) {
    const time24 = hour.toString().padStart(2, "0") + ":00";
    const hour12 = hour <= 12 ? hour : hour - 12;
    const ampm = hour < 12 ? "AM" : "PM";
    const displayTime = `${hour12 === 0 ? 12 : hour12}:00 ${ampm}`;
    timeOptions.push({ value: time24, label: displayTime });
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white border-4 border-black max-w-md w-full p-6"
        style={{ boxShadow: "8px 8px 0px #000000" }}
      >
        <h2
          className="text-[14px] text-black mb-4"
          style={{ fontFamily: "Press Start 2P" }}
        >
          SCHEDULE NEWSLETTER
        </h2>

        <p className="text-[10px] text-black mb-6">
          SELECT DATE AND TIME TO SEND NEWSLETTER
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-[12px] text-black block mb-2">DATE</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-2 border-2 border-black text-[10px] text-black"
              style={{ fontFamily: "Press Start 2P" }}
            />
          </div>

          <div>
            <label className="text-[12px] text-black block mb-2">TIME</label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full p-2 border-2 border-black text-[10px] text-black"
              style={{ fontFamily: "Press Start 2P" }}
            >
              {timeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isScheduling}
            className="flex-1 px-4 py-3 border-2 border-black text-[10px] bg-white text-black hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              fontFamily: "Press Start 2P",
              boxShadow: "3px 3px 0px #000000",
            }}
          >
            CANCEL
          </button>
          <button
            onClick={handleConfirm}
            disabled={isScheduling}
            className="flex-1 px-4 py-3 border-2 border-black text-[10px] bg-white text-black hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              fontFamily: "Press Start 2P",
              boxShadow: "3px 3px 0px #000000",
            }}
          >
            {isScheduling ? "SCHEDULING..." : "SCHEDULE"}
          </button>
        </div>
      </div>
    </div>
  );
}
