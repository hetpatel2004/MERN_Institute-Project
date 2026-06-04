const Holiday = require("../models/Holiday");
const HolidayNotification = require("../models/HolidayNotification");
const User = require("../models/User");
const Counsellor = require("../models/Counsellor");
const Student = require("../models/Student");

exports.getAll = async (req, res) => {
  try {
    const { search, year, holidayType, status, month, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (year) filter.year = parseInt(year);
    else filter.year = new Date().getFullYear();

    if (month) {
      const m = parseInt(month) - 1;
      const start = new Date(filter.year, m, 1);
      const end = new Date(filter.year, m + 1, 1);
      filter.holidayDate = { $gte: start, $lt: end };
    }

    if (holidayType) filter.holidayType = holidayType;
    if (status) filter.status = status;

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ holidayName: regex }, { description: regex }];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Holiday.countDocuments(filter);
    const holidays = await Holiday.find(filter)
      .populate("createdBy", "name email")
      .sort({ holidayDate: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({ holidays, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch holidays", error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const holiday = await Holiday.findById(req.params.id).populate("createdBy", "name email");
    if (!holiday) return res.status(404).json({ message: "Holiday not found" });
    res.json({ holiday });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch holiday", error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { holidayName, holidayDate, holidayType, description, reminderDays, status } = req.body;
    if (!holidayName || !holidayDate || !holidayType) {
      return res.status(400).json({ message: "Name, date, and type are required" });
    }

    const dateObj = new Date(holidayDate);
    const year = dateObj.getFullYear();

    const holiday = await Holiday.create({
      holidayName,
      holidayDate: dateObj,
      holidayType,
      description: description || "",
      reminderDays: reminderDays || 1,
      status: status || "Active",
      createdBy: req.user?._id || null,
      year,
    });

    res.status(201).json({ message: "Holiday created successfully", holiday });
  } catch (error) {
    res.status(400).json({ message: "Failed to create holiday", error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const holiday = await Holiday.findById(req.params.id);
    if (!holiday) return res.status(404).json({ message: "Holiday not found" });

    const { holidayName, holidayDate, holidayType, description, reminderDays, status } = req.body;
    if (holidayName !== undefined) holiday.holidayName = holidayName;
    if (holidayDate !== undefined) {
      holiday.holidayDate = new Date(holidayDate);
      holiday.year = holiday.holidayDate.getFullYear();
    }
    if (holidayType !== undefined) holiday.holidayType = holidayType;
    if (description !== undefined) holiday.description = description;
    if (reminderDays !== undefined) holiday.reminderDays = reminderDays;
    if (status !== undefined) holiday.status = status;

    await holiday.save();
    res.json({ message: "Holiday updated successfully", holiday });
  } catch (error) {
    res.status(400).json({ message: "Failed to update holiday", error: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const holiday = await Holiday.findByIdAndDelete(req.params.id);
    if (!holiday) return res.status(404).json({ message: "Holiday not found" });

    await HolidayNotification.deleteMany({ holidayId: holiday._id });
    res.json({ message: "Holiday deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete holiday", error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const startOfNextMonth = new Date(currentYear, currentMonth + 1, 1);

    const [totalHolidays, upcomingHolidays, currentMonthHolidays, scheduledReminders] = await Promise.all([
      Holiday.countDocuments({ year: currentYear, status: "Active" }),
      Holiday.countDocuments({ holidayDate: { $gte: now }, status: "Active" }),
      Holiday.countDocuments({ holidayDate: { $gte: startOfMonth, $lt: startOfNextMonth }, status: "Active" }),
      HolidayNotification.countDocuments({ deliveryStatus: { $in: ["pending", "sent"] } }),
    ]);

    res.json({ totalHolidays, upcomingHolidays, currentMonthHolidays, scheduledReminders });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stats", error: error.message });
  }
};

exports.getUpcoming = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const holidays = await Holiday.find({
      holidayDate: { $gte: now, $lte: thirtyDaysLater },
      status: "Active",
    }).sort({ holidayDate: 1 });

    res.json({ holidays });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch upcoming holidays", error: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await HolidayNotification.countDocuments();
    const notifications = await HolidayNotification.find()
      .populate("holidayId", "holidayName holidayDate")
      .sort({ sentDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({ notifications, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
  }
};

exports.getNotificationLogs = async (req, res) => {
  try {
    const { holidayId } = req.params;
    const logs = await HolidayNotification.find({ holidayId })
      .sort({ sentDate: -1 });
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notification logs", error: error.message });
  }
};

exports.getRoleCounts = async (req, res) => {
  try {
    const [superAdminCount, adminCount, branchAdminCount, counsellorCount, facultyCount, studentCount, staffCount] = await Promise.all([
      User.countDocuments({ role: "superadmin", status: "Active" }),
      User.countDocuments({ role: "admin", status: "Active" }),
      User.countDocuments({ role: "branchadmin", status: "Active" }),
      Counsellor.countDocuments({ status: "Active" }),
      User.countDocuments({ role: "faculty", status: "Active" }),
      Student.countDocuments({ status: "Active" }),
      User.countDocuments({ role: "staff", status: "Active" }),
    ]);

    res.json({
      roles: [
        { role: "Super Admin", key: "superadmin", count: superAdminCount, notifications: ["in-app", "email"] },
        { role: "Admin", key: "admin", count: adminCount, notifications: ["in-app", "email"] },
        { role: "Branch Manager", key: "branchadmin", count: branchAdminCount, notifications: ["in-app", "email"] },
        { role: "Counselor", key: "counsellor", count: counsellorCount, notifications: ["in-app", "email"] },
        { role: "Faculty", key: "faculty", count: facultyCount, notifications: ["in-app", "email"] },
        { role: "Student", key: "student", count: studentCount, notifications: ["in-app", "email"] },
        { role: "Staff", key: "staff", count: staffCount, notifications: ["in-app", "email"] },
      ],
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch role counts", error: error.message });
  }
};

const PRELOADED_HOLIDAYS = [
  // ═══════════════════════════════════════════════════════════════════════════════
  // JANUARY
  // ═══════════════════════════════════════════════════════════════════════════════
  { name: "New Year's Day", type: "National Holiday", month: 0, day: 1 },
  { name: "Guru Gobind Singh Jayanti", type: "Festival Holiday", month: 0, day: 5 },
  { name: "National Youth Day (Swami Vivekananda Jayanti)", type: "National Holiday", month: 0, day: 12 },
  { name: "Lohri", type: "Festival Holiday", month: 0, day: 13 },
  { name: "Bhogi", type: "Optional Holiday", month: 0, day: 13 },
  { name: "Makar Sankranti", type: "Festival Holiday", month: 0, day: 14 },
  { name: "Uttarayan", type: "Festival Holiday", month: 0, day: 14 },
  { name: "Pongal (Thai Pongal)", type: "Festival Holiday", month: 0, day: 15 },
  { name: "Army Day", type: "National Holiday", month: 0, day: 15 },
  { name: "Mattu Pongal", type: "Festival Holiday", month: 0, day: 16 },
  { name: "Thiruvalluvar Day", type: "Festival Holiday", month: 0, day: 16 },
  { name: "Kanuma Panduga", type: "Festival Holiday", month: 0, day: 17 },
  { name: "Netaji Subhas Chandra Bose Jayanti", type: "National Holiday", month: 0, day: 23 },
  { name: "National Girl Child Day", type: "National Holiday", month: 0, day: 24 },
  { name: "National Voters' Day", type: "National Holiday", month: 0, day: 25 },
  { name: "National Tourism Day", type: "National Holiday", month: 0, day: 25 },
  { name: "Republic Day", type: "National Holiday", month: 0, day: 26 },
  { name: "International Customs Day", type: "National Holiday", month: 0, day: 26 },
  { name: "World Leprosy Day", type: "National Holiday", month: 0, day: 28 },
  { name: "Vasant Panchami (Saraswati Puja)", type: "Festival Holiday", month: 0, day: 29 },
  { name: "Martyrs' Day (Shaheed Diwas)", type: "National Holiday", month: 0, day: 30 },
  { name: "Makaravilakku", type: "Optional Holiday", month: 0, day: 14 },
  { name: "Winter Vacation End", type: "Optional Holiday", month: 0, day: 1 },
  { name: "New Year Bank Holiday", type: "Bank Holiday", month: 0, day: 1 },
  { name: "Republic Day Bank Holiday", type: "Bank Holiday", month: 0, day: 26 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // FEBRUARY
  // ═══════════════════════════════════════════════════════════════════════════════
  { name: "World Cancer Day", type: "National Holiday", month: 1, day: 4 },
  { name: "Ratha Saptami", type: "Festival Holiday", month: 1, day: 7 },
  { name: "Narmada Jayanti", type: "Festival Holiday", month: 1, day: 11 },
  { name: "National Women's Day (Sarojini Naidu Jayanti)", type: "National Holiday", month: 1, day: 13 },
  { name: "Valentine's Day", type: "Optional Holiday", month: 1, day: 14 },
  { name: "Guru Ravidas Jayanti", type: "Festival Holiday", month: 1, day: 16 },
  { name: "Maha Shivratri", type: "Festival Holiday", month: 1, day: 18 },
  { name: "National Science Day", type: "National Holiday", month: 1, day: 28 },
  { name: "Shab-e-Barat", type: "Festival Holiday", month: 1, day: 14 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // MARCH
  // ═══════════════════════════════════════════════════════════════════════════════
  { name: "National Defence Day", type: "National Holiday", month: 2, day: 3 },
  { name: "National Safety Day", type: "National Holiday", month: 2, day: 4 },
  { name: "International Women's Day", type: "National Holiday", month: 2, day: 8 },
  { name: "Holika Dahan", type: "Festival Holiday", month: 2, day: 13 },
  { name: "Holi", type: "Festival Holiday", month: 2, day: 14 },
  { name: "Hola Mohalla", type: "Festival Holiday", month: 2, day: 14 },
  { name: "World Consumer Rights Day", type: "National Holiday", month: 2, day: 15 },
  { name: "International Day of Happiness", type: "Optional Holiday", month: 2, day: 20 },
  { name: "World Sparrow Day", type: "National Holiday", month: 2, day: 20 },
  { name: "World Oral Health Day", type: "National Holiday", month: 2, day: 20 },
  { name: "World Forestry Day", type: "National Holiday", month: 2, day: 21 },
  { name: "World Water Day", type: "National Holiday", month: 2, day: 22 },
  { name: "Gudi Padwa (Marathi New Year)", type: "Festival Holiday", month: 2, day: 22 },
  { name: "Ugadi (Telugu New Year)", type: "Festival Holiday", month: 2, day: 22 },
  { name: "Cheti Chand (Sindhi New Year)", type: "Festival Holiday", month: 2, day: 22 },
  { name: "Chaitra Navratri Start", type: "Festival Holiday", month: 2, day: 22 },
  { name: "World Meteorological Day", type: "National Holiday", month: 2, day: 23 },
  { name: "Shaheed Diwas (Bhagat Singh, Rajguru, Sukhdev)", type: "National Holiday", month: 2, day: 23 },
  { name: "World Tuberculosis Day", type: "National Holiday", month: 2, day: 24 },
  { name: "World Theatre Day", type: "Optional Holiday", month: 2, day: 27 },
  { name: "Ram Navami", type: "Festival Holiday", month: 2, day: 30 },
  { name: "Holi Bank Holiday", type: "Bank Holiday", month: 2, day: 14 },
  { name: "Annual Bank Audit Day", type: "Bank Holiday", month: 2, day: 31 },
  { name: "Financial Closing Day", type: "Bank Holiday", month: 2, day: 31 },
  { name: "Quarterly Audit Day", type: "Bank Holiday", month: 2, day: 31 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // APRIL
  // ═══════════════════════════════════════════════════════════════════════════════
  { name: "April Fools' Day", type: "Optional Holiday", month: 3, day: 1 },
  { name: "World Autism Awareness Day", type: "National Holiday", month: 3, day: 2 },
  { name: "Hanuman Jayanti", type: "Festival Holiday", month: 3, day: 6 },
  { name: "World Health Day", type: "National Holiday", month: 3, day: 7 },
  { name: "Mahavir Jayanti", type: "Festival Holiday", month: 3, day: 10 },
  { name: "Jallianwala Bagh Day", type: "National Holiday", month: 3, day: 13 },
  { name: "Baisakhi (Vaisakhi)", type: "Festival Holiday", month: 3, day: 13 },
  { name: "Ambedkar Jayanti", type: "National Holiday", month: 3, day: 14 },
  { name: "Vishu", type: "Festival Holiday", month: 3, day: 14 },
  { name: "Poila Boishakh (Bengali New Year)", type: "Festival Holiday", month: 3, day: 14 },
  { name: "Puthandu (Tamil New Year)", type: "Festival Holiday", month: 3, day: 14 },
  { name: "Bohag Bihu (Assamese New Year)", type: "Festival Holiday", month: 3, day: 14 },
  { name: "Good Friday", type: "Festival Holiday", month: 3, day: 14 },
  { name: "Chitra Pournami", type: "Optional Holiday", month: 3, day: 14 },
  { name: "Easter Sunday", type: "Festival Holiday", month: 3, day: 16 },
  { name: "Palm Sunday", type: "Festival Holiday", month: 3, day: 7 },
  { name: "Maundy Thursday", type: "Festival Holiday", month: 3, day: 13 },
  { name: "World Heritage Day", type: "National Holiday", month: 3, day: 18 },
  { name: "Eid-ul-Fitr (Ramzan Eid)", type: "Festival Holiday", month: 3, day: 20 },
  { name: "Shab-e-Qadr", type: "Festival Holiday", month: 3, day: 18 },
  { name: "Jumu'atul-Wida", type: "Festival Holiday", month: 3, day: 19 },
  { name: "World Earth Day", type: "National Holiday", month: 3, day: 22 },
  { name: "World Book Day", type: "National Holiday", month: 3, day: 23 },
  { name: "National Panchayati Raj Day", type: "National Holiday", month: 3, day: 24 },
  { name: "World Veterinary Day", type: "National Holiday", month: 3, day: 27 },
  { name: "Akshaya Tritiya", type: "Optional Holiday", month: 3, day: 26 },
  { name: "Summer Vacation Start", type: "Optional Holiday", month: 3, day: 30 },
  { name: "Good Friday Bank Holiday", type: "Bank Holiday", month: 3, day: 14 },
  { name: "Half Year Closing Day", type: "Bank Holiday", month: 2, day: 31 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // MAY
  // ═══════════════════════════════════════════════════════════════════════════════
  { name: "Labour Day (International Workers' Day)", type: "National Holiday", month: 4, day: 1 },
  { name: "Maharashtra Day", type: "National Holiday", month: 4, day: 1 },
  { name: "World Press Freedom Day", type: "National Holiday", month: 4, day: 3 },
  { name: "Rabindra Jayanti (Tagore Jayanti)", type: "National Holiday", month: 4, day: 7 },
  { name: "World Red Cross Day", type: "National Holiday", month: 4, day: 8 },
  { name: "National Technology Day", type: "National Holiday", month: 4, day: 11 },
  { name: "International Nurses Day", type: "National Holiday", month: 4, day: 12 },
  { name: "Mother's Day", type: "Optional Holiday", month: 4, day: 12 },
  { name: "Buddha Purnima", type: "Festival Holiday", month: 4, day: 12 },
  { name: "International Day of Families", type: "National Holiday", month: 4, day: 15 },
  { name: "National Anti-Terrorism Day", type: "National Holiday", month: 4, day: 21 },
  { name: "Commonwealth Day", type: "National Holiday", month: 4, day: 24 },
  { name: "World Menstrual Hygiene Day", type: "National Holiday", month: 4, day: 28 },
  { name: "World No Tobacco Day", type: "National Holiday", month: 4, day: 31 },
  { name: "Gangaur", type: "Optional Holiday", month: 4, day: 8 },
  { name: "Labour Day Bank Holiday", type: "Bank Holiday", month: 4, day: 1 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // JUNE
  // ═══════════════════════════════════════════════════════════════════════════════
  { name: "Global Day of Parents", type: "National Holiday", month: 5, day: 1 },
  { name: "World Environment Day", type: "National Holiday", month: 5, day: 5 },
  { name: "Martyrdom of Guru Arjan Dev Ji", type: "Festival Holiday", month: 5, day: 10 },
  { name: "World Blood Donor Day", type: "National Holiday", month: 5, day: 14 },
  { name: "Father's Day", type: "Optional Holiday", month: 5, day: 16 },
  { name: "International Day of Yoga", type: "National Holiday", month: 5, day: 21 },
  { name: "International Olympic Day", type: "National Holiday", month: 5, day: 23 },
  { name: "International Day Against Drug Abuse", type: "National Holiday", month: 5, day: 26 },
  { name: "Eid-ul-Adha (Bakrid)", type: "Festival Holiday", month: 5, day: 28 },
  { name: "Vat Purnima", type: "Optional Holiday", month: 5, day: 15 },
  { name: "Summer Vacation End", type: "Optional Holiday", month: 5, day: 30 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // JULY
  // ═══════════════════════════════════════════════════════════════════════════════
  { name: "National Doctors Day", type: "National Holiday", month: 6, day: 1 },
  { name: "Muharram (Islamic New Year)", type: "Festival Holiday", month: 6, day: 8 },
  { name: "World Population Day", type: "National Holiday", month: 6, day: 11 },
  { name: "Guru Purnima", type: "Festival Holiday", month: 6, day: 13 },
  { name: "World Youth Skills Day", type: "National Holiday", month: 6, day: 15 },
  { name: "Naga Panchami", type: "Festival Holiday", month: 6, day: 22 },
  { name: "Rath Yatra", type: "Festival Holiday", month: 6, day: 22 },
  { name: "Lokmanya Tilak Jayanti", type: "National Holiday", month: 6, day: 23 },
  { name: "Chandra Shekhar Azad Jayanti", type: "National Holiday", month: 6, day: 23 },
  { name: "Kargil Vijay Diwas", type: "National Holiday", month: 6, day: 26 },
  { name: "World Hepatitis Day", type: "National Holiday", month: 6, day: 28 },
  { name: "International Day of Friendship", type: "Optional Holiday", month: 6, day: 30 },
  { name: "Teej (Hartalika Teej)", type: "Optional Holiday", month: 6, day: 17 },
  { name: "Asalha Puja (Dharma Chakra Day)", type: "Festival Holiday", month: 6, day: 20 },
  { name: "Quarterly Audit Day", type: "Bank Holiday", month: 5, day: 30 },
  { name: "Foundation Day", type: "Company Holiday", month: 6, day: 1 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // AUGUST
  // ═══════════════════════════════════════════════════════════════════════════════
  { name: "World Breastfeeding Week", type: "National Holiday", month: 7, day: 1 },
  { name: "Friendship Day", type: "Optional Holiday", month: 7, day: 4 },
  { name: "Quit India Movement Day", type: "National Holiday", month: 7, day: 9 },
  { name: "International Youth Day", type: "National Holiday", month: 7, day: 12 },
  { name: "Onam", type: "Festival Holiday", month: 7, day: 13 },
  { name: "Independence Day", type: "National Holiday", month: 7, day: 15 },
  { name: "Parsi New Year (Navroz)", type: "Festival Holiday", month: 7, day: 16 },
  { name: "Varalakshmi Vratam", type: "Festival Holiday", month: 7, day: 16 },
  { name: "World Photography Day", type: "Optional Holiday", month: 7, day: 19 },
  { name: "Rajiv Gandhi Jayanti", type: "National Holiday", month: 7, day: 20 },
  { name: "Raksha Bandhan", type: "Festival Holiday", month: 7, day: 22 },
  { name: "World Sanskrit Day", type: "National Holiday", month: 7, day: 22 },
  { name: "Narali Purnima", type: "Festival Holiday", month: 7, day: 22 },
  { name: "National Space Day", type: "National Holiday", month: 7, day: 23 },
  { name: "Avani Avittam (Upakarma)", type: "Festival Holiday", month: 7, day: 24 },
  { name: "Mother Teresa Jayanti", type: "National Holiday", month: 7, day: 26 },
  { name: "National Sports Day (Major Dhyan Chand Jayanti)", type: "National Holiday", month: 7, day: 29 },
  { name: "Janmashtami (Krishna Jayanti)", type: "Festival Holiday", month: 7, day: 30 },
  { name: "Paryushan Start", type: "Festival Holiday", month: 7, day: 20 },
  { name: "Nag Panchami", type: "Optional Holiday", month: 7, day: 9 },
  { name: "Independence Day Bank Holiday", type: "Bank Holiday", month: 7, day: 15 },
  { name: "Janmashtami Bank Holiday", type: "Bank Holiday", month: 7, day: 30 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // SEPTEMBER
  // ═══════════════════════════════════════════════════════════════════════════════
  { name: "National Nutrition Week", type: "National Holiday", month: 8, day: 1 },
  { name: "Hartalika Teej", type: "Festival Holiday", month: 8, day: 5 },
  { name: "Teachers' Day (Dr. Radhakrishnan Jayanti)", type: "National Holiday", month: 8, day: 5 },
  { name: "Ganesh Chaturthi", type: "Festival Holiday", month: 8, day: 8 },
  { name: "International Literacy Day", type: "National Holiday", month: 8, day: 8 },
  { name: "Onam", type: "Festival Holiday", month: 8, day: 12 },
  { name: "Hindi Diwas", type: "National Holiday", month: 8, day: 14 },
  { name: "Engineers' Day (Visvesvaraya Jayanti)", type: "National Holiday", month: 8, day: 15 },
  { name: "International Day of Democracy", type: "National Holiday", month: 8, day: 15 },
  { name: "World Ozone Day", type: "National Holiday", month: 8, day: 16 },
  { name: "Vishwakarma Puja", type: "Festival Holiday", month: 8, day: 17 },
  { name: "Anant Chaturdashi", type: "Festival Holiday", month: 8, day: 19 },
  { name: "Mahalaya", type: "Festival Holiday", month: 8, day: 20 },
  { name: "International Day of Peace", type: "National Holiday", month: 8, day: 21 },
  { name: "International Day of Sign Languages", type: "National Holiday", month: 8, day: 23 },
  { name: "World Pharmacists Day", type: "National Holiday", month: 8, day: 25 },
  { name: "World Tourism Day", type: "National Holiday", month: 8, day: 27 },
  { name: "World Rabies Day", type: "National Holiday", month: 8, day: 28 },
  { name: "World Heart Day", type: "National Holiday", month: 8, day: 29 },
  { name: "Samvatsari (Jain Forgiveness Day)", type: "Festival Holiday", month: 8, day: 10 },
  { name: "Milad-un-Nabi (Id-e-Milad)", type: "Festival Holiday", month: 8, day: 25 },
  { name: "Annual Sports Day", type: "Company Holiday", month: 8, day: 15 },
  { name: "Quarterly Audit Day", type: "Bank Holiday", month: 8, day: 30 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // OCTOBER
  // ═══════════════════════════════════════════════════════════════════════════════
  { name: "Wildlife Week", type: "National Holiday", month: 9, day: 1 },
  { name: "Gandhi Jayanti", type: "National Holiday", month: 9, day: 2 },
  { name: "Lal Bahadur Shastri Jayanti", type: "National Holiday", month: 9, day: 2 },
  { name: "World Habitat Day", type: "National Holiday", month: 9, day: 3 },
  { name: "World Teachers' Day", type: "National Holiday", month: 9, day: 5 },
  { name: "Navratri Starts", type: "Festival Holiday", month: 9, day: 6 },
  { name: "World Post Day", type: "National Holiday", month: 9, day: 9 },
  { name: "World Mental Health Day", type: "National Holiday", month: 9, day: 10 },
  { name: "International Day of the Girl Child", type: "National Holiday", month: 9, day: 11 },
  { name: "World Sight Day", type: "National Holiday", month: 9, day: 12 },
  { name: "Durga Puja (Maha Saptami)", type: "Festival Holiday", month: 9, day: 14 },
  { name: "Durga Ashtami (Maha Ashtami)", type: "Festival Holiday", month: 9, day: 15 },
  { name: "Maha Navami", type: "Festival Holiday", month: 9, day: 16 },
  { name: "Ayudha Puja", type: "Festival Holiday", month: 9, day: 16 },
  { name: "Dussehra (Vijayadashami)", type: "Festival Holiday", month: 9, day: 17 },
  { name: "World Students' Day (APJ Abdul Kalam Jayanti)", type: "National Holiday", month: 9, day: 15 },
  { name: "World Food Day", type: "National Holiday", month: 9, day: 16 },
  { name: "International Day for Eradication of Poverty", type: "National Holiday", month: 9, day: 17 },
  { name: "Maharishi Valmiki Jayanti", type: "Festival Holiday", month: 9, day: 17 },
  { name: "Ayurveda Day", type: "National Holiday", month: 9, day: 19 },
  { name: "Karwa Chauth", type: "Festival Holiday", month: 9, day: 24 },
  { name: "World Polio Day", type: "National Holiday", month: 9, day: 24 },
  { name: "World Development Information Day", type: "National Holiday", month: 9, day: 24 },
  { name: "World Iodine Deficiency Day", type: "National Holiday", month: 9, day: 21 },
  { name: "Ahoi Ashtami", type: "Optional Holiday", month: 9, day: 22 },
  { name: "Rashtriya Ekta Diwas (Sardar Patel Jayanti)", type: "National Holiday", month: 9, day: 31 },
  { name: "National Unity Day", type: "National Holiday", month: 9, day: 31 },
  { name: "Gandhi Jayanti Bank Holiday", type: "Bank Holiday", month: 9, day: 2 },
  { name: "Dussehra Bank Holiday", type: "Bank Holiday", month: 9, day: 17 },
  { name: "Team Building Day", type: "Company Holiday", month: 9, day: 15 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // NOVEMBER
  // ═══════════════════════════════════════════════════════════════════════════════
  { name: "Diwali (Deepavali)", type: "Festival Holiday", month: 10, day: 1 },
  { name: "Naraka Chaturdashi (Choti Diwali)", type: "Optional Holiday", month: 10, day: 1 },
  { name: "Govardhan Puja (Annakut)", type: "Festival Holiday", month: 10, day: 2 },
  { name: "Bhai Dooj", type: "Festival Holiday", month: 10, day: 3 },
  { name: "Chhath Puja", type: "Festival Holiday", month: 10, day: 5 },
  { name: "National Cancer Awareness Day", type: "National Holiday", month: 10, day: 7 },
  { name: "Uttarakhand Foundation Day", type: "National Holiday", month: 10, day: 9 },
  { name: "National Education Day (Maulana Azad Jayanti)", type: "National Holiday", month: 10, day: 11 },
  { name: "Children's Day (Chacha Nehru Jayanti)", type: "National Holiday", month: 10, day: 14 },
  { name: "Guru Nanak Dev Ji Jayanti", type: "Festival Holiday", month: 10, day: 15 },
  { name: "Kartik Purnima", type: "Festival Holiday", month: 10, day: 15 },
  { name: "Bandi Chhor Divas", type: "Festival Holiday", month: 10, day: 1 },
  { name: "National Press Day", type: "National Holiday", month: 10, day: 16 },
  { name: "Dev Deepawali", type: "Festival Holiday", month: 10, day: 17 },
  { name: "National Naturopathy Day", type: "National Holiday", month: 10, day: 18 },
  { name: "Indira Gandhi Jayanti", type: "National Holiday", month: 10, day: 19 },
  { name: "World Television Day", type: "Optional Holiday", month: 10, day: 21 },
  { name: "World Philosophy Day", type: "National Holiday", month: 10, day: 21 },
  { name: "Tulsi Vivah", type: "Optional Holiday", month: 10, day: 22 },
  { name: "International Day for Elimination of Violence Against Women", type: "National Holiday", month: 10, day: 25 },
  { name: "Constitution Day (National Law Day)", type: "National Holiday", month: 10, day: 26 },
  { name: "Mahavir Nirvana Day (Diwali)", type: "Festival Holiday", month: 10, day: 1 },
  { name: "World Diabetes Day", type: "National Holiday", month: 10, day: 14 },
  { name: "Diwali Bank Holiday", type: "Bank Holiday", month: 10, day: 1 },
  { name: "Guru Nanak Jayanti Bank Holiday", type: "Bank Holiday", month: 10, day: 15 },
  { name: "Company Anniversary", type: "Company Holiday", month: 10, day: 1 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // DECEMBER
  // ═══════════════════════════════════════════════════════════════════════════════
  { name: "World AIDS Day", type: "National Holiday", month: 11, day: 1 },
  { name: "National Pollution Control Day", type: "National Holiday", month: 11, day: 2 },
  { name: "World Computer Literacy Day", type: "National Holiday", month: 11, day: 2 },
  { name: "Navy Day", type: "National Holiday", month: 11, day: 4 },
  { name: "Armed Forces Flag Day", type: "National Holiday", month: 11, day: 7 },
  { name: "International Anti-Corruption Day", type: "National Holiday", month: 11, day: 9 },
  { name: "Human Rights Day", type: "National Holiday", month: 11, day: 10 },
  { name: "International Mountain Day", type: "National Holiday", month: 11, day: 11 },
  { name: "National Energy Conservation Day", type: "National Holiday", month: 11, day: 14 },
  { name: "National Mathematics Day (Ramanujan Jayanti)", type: "National Holiday", month: 11, day: 22 },
  { name: "Good Governance Day (Vajpayee Jayanti)", type: "National Holiday", month: 11, day: 23 },
  { name: "Kisan Diwas (National Farmers Day)", type: "National Holiday", month: 11, day: 23 },
  { name: "Christmas Eve", type: "Festival Holiday", month: 11, day: 24 },
  { name: "Christmas Day", type: "National Holiday", month: 11, day: 25 },
  { name: "Boxing Day", type: "Optional Holiday", month: 11, day: 26 },
  { name: "New Year's Eve", type: "Optional Holiday", month: 11, day: 31 },
  { name: "Karthigai Deepam", type: "Optional Holiday", month: 11, day: 8 },
  { name: "Lhabab Duchen", type: "Festival Holiday", month: 11, day: 15 },
  { name: "Winter Vacation Start", type: "Optional Holiday", month: 11, day: 25 },
  { name: "Year End Bank Closing", type: "Bank Holiday", month: 11, day: 31 },
  { name: "Christmas Bank Holiday", type: "Bank Holiday", month: 11, day: 25 },
  { name: "Quarterly Audit Day", type: "Bank Holiday", month: 11, day: 31 },
  { name: "Annual Function Day", type: "Company Holiday", month: 11, day: 20 },
  { name: "Sports Day", type: "Company Holiday", month: 11, day: 15 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // COMPANY HOLIDAYS (Month-assigned for preload)
  // ═══════════════════════════════════════════════════════════════════════════════
  { name: "Family Day", type: "Company Holiday", month: 0, day: 10 },
  { name: "Employee Appreciation Day", type: "Company Holiday", month: 2, day: 5 },
  { name: "Training Day", type: "Company Holiday", month: 4, day: 10 },
  { name: "Innovation Day", type: "Company Holiday", month: 6, day: 15 },
  { name: "CSR Activity Day", type: "Company Holiday", month: 8, day: 10 },
  { name: "Annual Picnic Day", type: "Company Holiday", month: 10, day: 20 },

  // ═══════════════════════════════════════════════════════════════════════════════
  // SCHOOL / COLLEGE HOLIDAYS
  // ═══════════════════════════════════════════════════════════════════════════════
  { name: "Graduation Day", type: "Company Holiday", month: 8, day: 25 },
  { name: "Freshers Day", type: "Company Holiday", month: 1, day: 1 },
  { name: "Farewell Day", type: "Company Holiday", month: 10, day: 30 },
  { name: "Exam Break Start", type: "Optional Holiday", month: 0, day: 4 },
  { name: "Exam Break End", type: "Optional Holiday", month: 3, day: 1 },
];

exports.preloadHolidays = async (req, res) => {
  try {
    const { year } = req.body;
    const targetYear = year || new Date().getFullYear();
    let created = 0;
    let skipped = 0;

    for (const h of PRELOADED_HOLIDAYS) {
      const holidayDate = new Date(targetYear, h.month, h.day);
      const existing = await Holiday.findOne({ holidayName: h.name, year: targetYear });
      if (!existing) {
        await Holiday.create({
          holidayName: h.name,
          holidayDate,
          holidayType: h.type,
          description: `${h.name} - ${targetYear}`,
          reminderDays: 1,
          status: "Active",
          year: targetYear,
          isPreloaded: true,
        });
        created++;
      } else {
        skipped++;
      }
    }

    res.json({ message: `Preloaded ${created} holidays (${skipped} already exist)`, created, skipped });
  } catch (error) {
    res.status(500).json({ message: "Failed to preload holidays", error: error.message });
  }
};

exports.bulkCreate = async (req, res) => {
  try {
    const { holidays } = req.body;
    if (!Array.isArray(holidays) || holidays.length === 0) {
      return res.status(400).json({ message: "Provide an array of holidays" });
    }

    let created = 0;
    let skipped = 0;
    const errors = [];

    for (let i = 0; i < holidays.length; i++) {
      const { holidayName, holidayDate, holidayType, description, reminderDays, status } = holidays[i];
      if (!holidayName || !holidayDate || !holidayType) {
        errors.push({ row: i + 1, message: "Missing required fields (name, date, type)" });
        continue;
      }
      try {
        const dateObj = new Date(holidayDate);
        const year = dateObj.getFullYear();
        const existing = await Holiday.findOne({ holidayName: holidayName.trim(), year });
        if (existing) {
          skipped++;
          continue;
        }
        await Holiday.create({
          holidayName: holidayName.trim(),
          holidayDate: dateObj,
          holidayType,
          description: description || "",
          reminderDays: reminderDays || 1,
          status: status || "Active",
          createdBy: req.user?._id || null,
          year,
        });
        created++;
      } catch (err) {
        errors.push({ row: i + 1, message: err.message });
      }
    }

    res.json({ message: `Created ${created} holidays (${skipped} skipped)`, created, skipped, errors });
  } catch (error) {
    res.status(500).json({ message: "Bulk upload failed", error: error.message });
  }
};

exports.processReminders = async () => {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const holidays = await Holiday.find({ status: "Active" });

    for (const holiday of holidays) {
      const diffTime = holiday.holidayDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === holiday.reminderDays) {
        const roles = ["superadmin", "admin", "branchadmin", "counsellor", "faculty", "student", "staff"];
        const message = `Tomorrow is ${holiday.holidayName} Holiday. Please complete your pending tasks before the holiday.`;

        for (const role of roles) {
          const existing = await HolidayNotification.findOne({
            holidayId: holiday._id,
            role,
            sentDate: { $gte: today },
          });

          if (!existing) {
            await HolidayNotification.create({
              holidayId: holiday._id,
              role,
              message,
              sentDate: now,
              deliveryStatus: "sent",
              notificationMethod: "in-app",
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Holiday reminder cron error:", error.message);
  }
};
