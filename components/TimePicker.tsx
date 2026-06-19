import { useState } from "react";

interface TimePickerProps {
  initialTime: string;
  onTimeChange: (time: string) => void;
  disabled?: boolean;
}

export default function TimePicker({
  initialTime,
  onTimeChange,
  disabled = false,
}: TimePickerProps) {
  const [selectedTime, setSelectedTime] = useState(initialTime);

  const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTime = event.target.value;
    setSelectedTime(newTime);
    onTimeChange(newTime);
  };

  // Generate time options (every hour from 6 AM to 11 PM)
  const timeOptions = [];
  for (let hour = 6; hour <= 23; hour++) {
    const time24 = hour.toString().padStart(2, "0") + ":00";
    const hour12 = hour <= 12 ? hour : hour - 12;
    const ampm = hour < 12 ? "AM" : "PM";
    const displayTime = `${hour12 === 0 ? 12 : hour12}:00 ${ampm}`;
    timeOptions.push({ value: time24, label: displayTime });
  }

  return (
    <div className="space-y-2">
      <label className="text-[12px] text-black block">SEND TIME</label>
      <select
        value={selectedTime}
        onChange={handleTimeChange}
        disabled={disabled}
        className="w-full p-2 border-2 border-black bg-white text-[10px] text-black disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ fontFamily: "Press Start 2P" }}
      >
        {timeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
