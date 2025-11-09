export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const scheduleMedicineNotification = (medicineName: string, time: string) => {
  if (Notification.permission !== "granted") {
    return;
  }

  const notification = new Notification("Medicine Reminder 💊", {
    body: `Time to take your ${medicineName}`,
    icon: "/placeholder.svg",
    badge: "/placeholder.svg",
    tag: `medicine-${medicineName}-${time}`,
    requireInteraction: true,
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
  };

  // Speak the reminder
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(`Time to take your ${medicineName}`);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
};

export const checkAndScheduleMedicineReminders = (medicines: any[]) => {
  if (Notification.permission !== "granted") {
    return;
  }

  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  medicines.forEach((medicine) => {
    if (medicine.active && medicine.times) {
      medicine.times.forEach((time: string) => {
        if (time === currentTime) {
          scheduleMedicineNotification(medicine.name, time);
        }
      });
    }
  });
};
