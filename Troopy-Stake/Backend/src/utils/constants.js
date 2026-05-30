const ROLES = Object.freeze({
  SUPER_ADMIN: "superadmin",
  BRANCH_ADMIN: "branchadmin",
  COMPANY_ADMIN: "companyadmin",
  STUDENT: "student",
  COUNSELLOR: "counsellor",
});

const LEAD_STATUSES = Object.freeze([
  "New",
  "Contacted",
  "Interested",
  "Follow-up",
  "Admitted",
  "Converted",
  "Not Interested",
]);

const LEAD_PRIORITIES = Object.freeze(["Hot", "Warm", "Cold"]);

const BRANCH_STATUSES = Object.freeze(["Active", "Inactive", "Blocked"]);

const INSTITUTE_STATUSES = Object.freeze(["Active", "Inactive"]);

const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
});

const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL: 500,
});

module.exports = {
  ROLES,
  LEAD_STATUSES,
  LEAD_PRIORITIES,
  BRANCH_STATUSES,
  INSTITUTE_STATUSES,
  PAGINATION,
  HTTP_STATUS,
};
