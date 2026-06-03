require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
require("./config/tigerdb");
const initHolidayReminderCron = require("./cron/holidayReminder");

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  const Branch = require("./models/Branch");
  await Branch.syncIndexes();

  initHolidayReminderCron();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  });
};

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
