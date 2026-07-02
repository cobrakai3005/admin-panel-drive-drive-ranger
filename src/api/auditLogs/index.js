import api from "../../config/axios";

const unwrap = (res) => res.data;

export const getAuditLogs = (params) =>
  api.get("/audit-logs/", { params }).then(unwrap);

export const getAuditLogByRecord = (tableName, recordId) =>
  api.get(`/audit-logs/${tableName}/${recordId}`).then(unwrap);
