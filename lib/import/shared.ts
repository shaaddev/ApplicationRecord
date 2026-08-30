import type { ApplicationInput } from "@/lib/applications";

/** Shared by the import dialog (client), the server action, and the queries. */
export const IMPORT_ROW_LIMIT = 500;
export const IMPORT_FILE_LIMIT = 2 * 1024 * 1024;
export const IMPORT_ACCEPT = ".csv,.tsv,.txt,.xlsx,.xlsm,.xls,.ods,.numbers";

/** One row to persist. `replaceId` overwrites that application instead of inserting. */
export type ImportRowInput = { input: ApplicationInput; replaceId?: number };
