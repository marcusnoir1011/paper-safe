"use client";

import { useEffect } from "react";

import toast from "react-hot-toast/headless";
import { Bell } from "lucide-react";

interface NotificationReminderProps {
  documents: any[];
}

export default function NotificationReminder({
  documents,
}: NotificationReminderProps) {
  useEffect(() => {
    if (typeof window === "undefined" || Notification.permission !== "granted")
      return;

    const todayDate = new Date().toISOString().split("T")[0];
    const billsDueToday = documents.filter(
      (doc) => !doc.is_paid && doc.due_date === todayDate,
    );

    billsDueToday.forEach((bill) => {
      new Notification("!! Bills Due Today !!", {
        body: `${bill.title} for JPY ${bill.amount} is due today.`,
        tag: bill.id,
        requireInteraction: true,
      });
    });
  }, [documents]);

  const enableNotifications = async () => {
    if (!("Notification" in window)) {
      toast.error("This browser does not support desktop notifications.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification("Paper Safe", {
          body: `Notifications enabled! We will keep your bills in check.`,
        });
      } else if (permission === "denied") {
        toast.error("Notification permission was denied.");
      }
    } catch (err) {
      console.error("Permission request failed.", err);
    }
  };

  return (
    <button
      onClick={enableNotifications}
      className="flex items-center shadow-sm gap-3 px-3 py-2 bg-surface border border-border-light rounded-xl hover:border-ink transition-colors"
    >
      <Bell
        size={24}
        className="text-ink group-hover:text-ink transition-colors"
      />
      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted group-hover:text-ink">
        Enable Reminder
      </span>
    </button>
  );
}
