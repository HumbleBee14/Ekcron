"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import {
  useTeamMembers,
  useTeamInvitations,
  useInviteMember,
  useUpdateRole,
  useRemoveMember,
  useRevokeInvitation,
} from "@/hooks/use-team";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address");

export default function TeamSettingsPage() {
  const { data: members, isLoading: membersLoading } = useTeamMembers();
  const { data: invitations, isLoading: invitationsLoading } =
    useTeamInvitations();
  const inviteMember = useInviteMember();
  const updateRole = useUpdateRole();
  const removeMember = useRemoveMember();
  const revokeInvitation = useRevokeInvitation();

  useEffect(() => {
    if (inviteMember.isSuccess) toast.success("Invitation sent");
  }, [inviteMember.isSuccess]);
  useEffect(() => {
    if (inviteMember.isError) toast.error(inviteMember.error.message);
  }, [inviteMember.isError, inviteMember.error]);
  useEffect(() => {
    if (updateRole.isSuccess) toast.success("Role updated");
  }, [updateRole.isSuccess]);
  useEffect(() => {
    if (updateRole.isError) toast.error(updateRole.error.message);
  }, [updateRole.isError, updateRole.error]);
  useEffect(() => {
    if (removeMember.isSuccess) toast.success("Member removed");
  }, [removeMember.isSuccess]);
  useEffect(() => {
    if (removeMember.isError) toast.error(removeMember.error.message);
  }, [removeMember.isError, removeMember.error]);
  useEffect(() => {
    if (revokeInvitation.isSuccess) toast.success("Invitation revoked");
  }, [revokeInvitation.isSuccess]);
  useEffect(() => {
    if (revokeInvitation.isError) toast.error(revokeInvitation.error.message);
  }, [revokeInvitation.isError, revokeInvitation.error]);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) setEmailError(null);
  };

  const handleInvite = () => {
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setEmailError(parsed.error.issues[0]?.message ?? "Enter a valid email address");
      return;
    }
    const normalized = parsed.data.toLowerCase();

    const alreadyMember = members?.some(
      (m) => m.email.toLowerCase() === normalized,
    );
    if (alreadyMember) {
      setEmailError("This person is already a team member");
      return;
    }

    const alreadyInvited = invitations?.some(
      (i) => i.status === "pending" && i.email.toLowerCase() === normalized,
    );
    if (alreadyInvited) {
      setEmailError("An invitation is already pending for this email");
      return;
    }

    setEmailError(null);
    inviteMember.mutate(
      { email: normalized, role },
      {
        onSuccess: () => {
          setEmail("");
          setRole("member");
        },
      },
    );
  };

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Team"
        description="Manage your team members and invitations."
      />

      {/* Invite Form */}
      <div className="card mb-6 p-5">
        <h2 className="section-heading mb-4">Invite a team member</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={`input-base ${
                emailError ? "border-red-400 focus:border-red-400 focus:ring-red-500/20 dark:border-red-500" : ""
              }`}
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
              aria-invalid={emailError ? true : undefined}
            />
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="input-base sm:w-36"
          >
            <option value="viewer">Viewer</option>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <Button
            onClick={handleInvite}
            disabled={!email.trim()}
            loading={inviteMember.isPending}
          >
            Send invite
          </Button>
        </div>
        {emailError ? (
          <p className="text-red-500 text-sm mt-2">{emailError}</p>
        ) : (
          inviteMember.isError && (
            <p className="text-red-400 text-sm mt-2">
              {inviteMember.error.message}
            </p>
          )
        )}
      </div>

      {/* Team Members */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="card-title">
            Team members{" "}
            {members && (
              <span className="font-normal text-zinc-500">({members.length})</span>
            )}
          </h2>
        </div>
        {membersLoading ? (
          <div className="px-5 py-10 text-center text-sm text-zinc-500">
            Loading members...
          </div>
        ) : members?.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-zinc-500">
            No team members yet.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/70">
            {members?.map((member) => {
              const isUpdatingRole =
                updateRole.isPending &&
                updateRole.variables?.userId === member.user_id;
              const isRemoving =
                removeMember.isPending &&
                removeMember.variables === member.user_id;

              return (
                <div
                  key={member.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4"
                >
                  <div className="min-w-0">
                    <p className="text-zinc-900 dark:text-white text-sm truncate">{member.email}</p>
                    <p className="text-zinc-500 text-xs">
                      Joined {new Date(member.joined_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {member.role === "owner" ? (
                      <span className="badge badge-warning">Owner</span>
                    ) : (
                      <select
                        value={member.role}
                        disabled={isUpdatingRole}
                        onChange={(e) =>
                          updateRole.mutate({
                            userId: member.user_id,
                            role: e.target.value,
                          })
                        }
                        className="input-base w-auto px-2 py-1 text-xs disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="viewer">Viewer</option>
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                    {member.role !== "owner" && (
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${member.email} from the team?`)) {
                            removeMember.mutate(member.user_id);
                          }
                        }}
                        disabled={isRemoving}
                        className="text-red-400 hover:text-red-300 text-xs transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isRemoving ? "Removing..." : "Remove"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pending Invitations */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            Pending invitations{" "}
            {invitations && (
              <span className="font-normal text-zinc-500">
                ({invitations.filter((i) => i.status === "pending").length})
              </span>
            )}
          </h2>
        </div>
        {invitationsLoading ? (
          <div className="px-5 py-10 text-center text-sm text-zinc-500">
            Loading invitations...
          </div>
        ) : !invitations?.some((i) => i.status === "pending") ? (
          <div className="px-5 py-10 text-center text-sm text-zinc-500">
            No pending invitations.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800/70">
            {invitations
              ?.filter((i) => i.status === "pending")
              .map((invitation) => {
                const isRevoking =
                  revokeInvitation.isPending &&
                  revokeInvitation.variables === invitation.id;

                return (
                  <div
                    key={invitation.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4"
                  >
                    <div className="min-w-0">
                      <p className="text-zinc-900 dark:text-white text-sm truncate">{invitation.email}</p>
                      <p className="text-zinc-500 text-xs">
                        Role: {invitation.role} &middot; Expires{" "}
                        {new Date(invitation.expires_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => revokeInvitation.mutate(invitation.id)}
                      disabled={isRevoking}
                      className="text-red-400 hover:text-red-300 text-xs transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRevoking ? "Revoking..." : "Revoke"}
                    </button>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
