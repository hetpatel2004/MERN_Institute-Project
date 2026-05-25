const express = require("express");

const router = express.Router();

const Role = require("../models/Role");



/* =========================================
   GET ALL ROLES
========================================= */

router.get("/roles", async (req, res) => {
    try {
        const roles = await Role.find().sort({
            createdAt: -1,
        });

        res.json(roles);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});



/* =========================================
   CREATE ROLE
========================================= */

router.post("/roles", async (req, res) => {
    try {
        const existingRoleName = await Role.findOne({
            roleName: req.body.roleName,
        });

        if (existingRoleName) {
            return res.status(400).json({
                message: "Role name already exists",
            });
        }

        const existingRoleCode = await Role.findOne({
            roleCode: req.body.roleCode,
        });

        if (existingRoleCode) {
            return res.status(400).json({
                message: "Role code already exists",
            });
        }

        const role = await Role.create(req.body);

        res.json(role);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});



/* =========================================
   UPDATE ROLE
========================================= */

router.put("/roles/:id", async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        res.json(role);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});



/* =========================================
   ENABLE / DISABLE ROLE
========================================= */

router.patch(
    "/roles/:id/status",
    async (req, res) => {
        try {
            const role = await Role.findById(
                req.params.id
            );

            if (!role) {
                return res.status(404).json({
                    message: "Role not found",
                });
            }

            role.status = !role.status;

            await role.save();

            res.json(role);
        } catch (err) {
            res.status(500).json({
                message: err.message,
            });
        }
    }
);



/* =========================================
   DELETE ROLE
========================================= */

router.delete("/roles/:id", async (req, res) => {
    try {
        await Role.findByIdAndDelete(
            req.params.id
        );

        res.json({
            message: "Role deleted successfully",
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});

router.get("/role-counts", async (req, res) => {
    try {
        const Institute = require("../models/Institute");
        const User = require("../models/User");

        const counts = {
            SUPER_ADMIN: 0,
            INSTITUTE_ADMIN: 0,
            BRANCH_ADMIN: 0,
            COMPANY_ADMIN: 0,
            FACULTY: 0,
            COUNSELLOR: 0,
            SALES_PERSON: 0,
            CALL_PERSON: 0,
            STUDENT: 0,
        };

        const users = await User.find();

        users.forEach((user) => {
            const roleCode = String(user.role || "").toUpperCase();

            if (roleCode === "SUPERADMIN") counts.SUPER_ADMIN += 1;
            if (roleCode === "INSTITUTEADMIN") counts.INSTITUTE_ADMIN += 1;
            if (roleCode === "BRANCHADMIN") counts.BRANCH_ADMIN += 1;
            if (roleCode === "COMPANYADMIN") counts.COMPANY_ADMIN += 1;
            if (roleCode === "STUDENT") counts.STUDENT += 1;
            if (roleCode === "FACULTY") counts.FACULTY += 1;
            if (roleCode === "COUNSELLOR") counts.COUNSELLOR += 1;
            if (roleCode === "SALES_PERSON") counts.SALES_PERSON += 1;
            if (roleCode === "CALL_PERSON") counts.CALL_PERSON += 1;
        });

        const institutes = await Institute.find();

        institutes.forEach((institute) => {
            if (institute.admin_id) {
                counts.INSTITUTE_ADMIN += 1;
            }

            counts.BRANCH_ADMIN += institute.branches?.length || 0;
        });

        res.json(counts);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});

/* =========================================
   GET USERS BY ROLE
========================================= */

router.get("/role-users/:roleCode", async (req, res) => {
    try {
        const User = require("../models/User");
        const { roleCode } = req.params;

        const roleMap = {
            SUPER_ADMIN: "superadmin",
            INSTITUTE_ADMIN: "instituteadmin",
            BRANCH_ADMIN: "branchadmin",
            COMPANY_ADMIN: "companyadmin",
            STUDENT: "student",
            FACULTY: "faculty",
            COUNSELLOR: "counsellor",
            SALES_PERSON: "sales_person",
            CALL_PERSON: "call_person",
        };

        const role = roleMap[roleCode];

        if (!role) {
            return res.status(400).json({
                message: "Invalid role code",
            });
        }

        const users = await User.find({ role }).sort({ createdAt: -1 });

        const finalUsers = users.map((user) => ({
            _id: user._id,
            fullName: user.name || "-",
            username: user.email || "-",
            email: user.email || "-",
            status: user.status || "Active",
            role: user.role,
        }));

        res.json(finalUsers);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
});

module.exports = router;