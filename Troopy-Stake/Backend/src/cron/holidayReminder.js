const cron = require("node-cron");
const { processReminders } = require("../controllers/holidayController");

const initHolidayReminderCron = () => {
  cron.schedule("0 9 * * *", async () => {
    console.log("[HolidayCron] Running daily holiday reminder check at 9:00 AM");
    await processReminders();
    console.log("[HolidayCron] Reminder check completed");
  });

  console.log("[HolidayCron] Scheduled daily at 9:00 AM");
};

module.exports = initHolidayReminderCron;
