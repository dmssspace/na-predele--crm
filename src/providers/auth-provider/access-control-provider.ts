import { AccessControlProvider } from "@refinedev/core";
import { authProviderClient } from "./auth-provider.client";
import type { UserRole } from "@/types/auth";

function isOwner(record: any, identity: any): boolean {
  if (!record || !identity) return false;

  const id = identity.id ?? identity._id ?? null;
  if (!id) return false;

  const candidates = [
    record.ownerId,
    record.owner_id,
    record.user_id,
    record.user?.id,
    record.user?._id,
    record.owner?.id,
    record.owner?._id,
    record.assignee_user?.id,
    record.assignee_user?._id,
    record.assignee_user_id,
  ];

  return candidates.some((c) => c !== undefined && c === id);
}

export const accessControlProvider: AccessControlProvider = {
  can: async ({ action, resource, params }) => {
    const permissions = authProviderClient.getPermissions
      ? await authProviderClient.getPermissions()
      : null;
    const identity = authProviderClient.getIdentity
      ? await authProviderClient.getIdentity()
      : null;

    const role = Array.isArray(permissions)
      ? (permissions[0] as UserRole | undefined)
      : undefined;
    const act = String(action ?? "").toLowerCase();
    const record = params?.record ?? params?.previous ?? params?.data ?? null;
    const owner = isOwner(record, identity);

    if (role === "admin") {
      return { can: true };
    }

    if (role === "moderator") {
      if (act.includes("delete")) {
        return { can: owner };
      }

      if (act.includes("edit") || act.includes("update")) {
        return { can: owner };
      }

      return { can: true };
    }
    if (role === "trainer") {
      if (act === "list" || act === "show" || act === "get" || act === "read") {
        return { can: true };
      }

      if (
        act.includes("edit") ||
        act.includes("update") ||
        act.includes("delete")
      ) {
        return { can: owner };
      }
      if (act === "create") {
        return { can: true };
      }

      return { can: false };
    }

    if (role === "customer") {
      if (
        act === "list" ||
        act === "show" ||
        act === "get" ||
        act === "read" ||
        act === "create"
      ) {
        return { can: true };
      }

      if (
        act.includes("edit") ||
        act.includes("update") ||
        act.includes("delete")
      ) {
        return { can: owner };
      }

      return { can: false };
    }

    return { can: false };
  },
};
