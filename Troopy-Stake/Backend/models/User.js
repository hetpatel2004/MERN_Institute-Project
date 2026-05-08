const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    institute_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
    },

    branch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },

    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["superadmin", "branchadmin", "companyadmin", "student"],
      required: true,
    },

    isApproved: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      default: "Active",
    },

    menuAccess: [String],

    loginInfo: {
      ipAddress: {
        type: String,
        default: "",
      },

      device: {
        type: String,
        default: "",
      },

      location: {
        latitude: {
          type: Number,
          default: null,
        },

        longitude: {
          type: Number,
          default: null,
        },
      },

      loginTime: {
        type: Date,
        default: null,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);