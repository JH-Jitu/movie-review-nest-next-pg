import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/config/axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  UserPlus,
  UserMinus,
  UserX,
  MoreHorizontal,
  Check,
  X,
  Ban,
} from "lucide-react";

interface FriendActionsProps {
  userId: string;
  initialStatus?: {
    status:
      | "FRIENDS"
      | "NOT_FRIENDS"
      | "REQUEST_SENT"
      | "REQUEST_RECEIVED"
      | "BLOCKED"
      | "SELF";
    requestId?: string;
  };
}

export function FriendActions({ userId, initialStatus }: FriendActionsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const { data: fullStatus } = useQuery({
    queryKey: ["friendStatus", userId],
    queryFn: async () => {
      console.log("Fetching friend status for userId:", userId);
      const { data } = await axiosInstance.get(
        `/users/${userId}/friend-status`
      );
      console.log("Friend status response:", data);
      return data;
    },
    initialData: initialStatus,
  });

  const status = fullStatus?.data;
  console.log("Current status:", status);

  const mutation = useMutation<
    any,
    Error,
    { action: string; requestId?: string | null }
  >({
    mutationFn: async ({ action, requestId = null }) => {
      switch (action) {
        case "SEND_REQUEST":
          return axiosInstance.post(`/users/${userId}/friend-request`);
        case "ACCEPT":
          return axiosInstance.put(
            `/users/friend-requests/${requestId}/accept`
          );
        case "REJECT":
          return axiosInstance.put(
            `/users/friend-requests/${requestId}/reject`
          );
        case "CANCEL":
          return axiosInstance.delete(`/users/friend-requests/${requestId}`);
        case "UNFRIEND":
          return axiosInstance.delete(`/users/friends/${userId}`);
        case "BLOCK":
          return axiosInstance.post(`/users/${userId}/block`);
        case "UNBLOCK":
          return axiosInstance.delete(`/users/${userId}/block`);
        default:
          throw new Error("Invalid action");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendStatus", userId] });
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });

  const handleAction = async (action: string) => {
    try {
      setIsLoading(true);
      await mutation.mutateAsync({ action, requestId: status?.requestId });

      const messages = {
        SEND_REQUEST: "Friend request sent!",
        ACCEPT: "Friend request accepted!",
        REJECT: "Friend request rejected",
        CANCEL: "Friend request cancelled",
        UNFRIEND: "Friend removed",
        BLOCK: "User blocked",
        UNBLOCK: "User unblocked",
      };

      toast({
        title: "Success",
        description: messages[action] || "Action completed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (status?.status === "SELF") return null;

  return (
    <div className="flex gap-2">
      {status?.status === "NOT_FRIENDS" && (
        <Button
          onClick={() => handleAction("SEND_REQUEST")}
          disabled={isLoading}
          variant="default"
          size="sm"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Friend
        </Button>
      )}

      {status?.status === "REQUEST_RECEIVED" && (
        <div className="flex gap-2">
          <Button
            onClick={() => handleAction("ACCEPT")}
            disabled={isLoading}
            size="sm"
          >
            <Check className="h-4 w-4 mr-2" />
            Accept
          </Button>
          <Button
            onClick={() => handleAction("REJECT")}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            <X className="h-4 w-4 mr-2" />
            Reject
          </Button>
        </div>
      )}

      {status?.status === "REQUEST_SENT" && (
        <Button
          onClick={() => handleAction("CANCEL")}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          Cancel Request
        </Button>
      )}

      {(status?.status === "FRIENDS" || status?.status === "BLOCKED") && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4 mr-2" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {status?.status === "FRIENDS" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <UserMinus className="h-4 w-4 mr-2" />
                    Unfriend
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Friend?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove this person from your
                      friends list?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleAction("UNFRIEND")}>
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <DropdownMenuSeparator />

            {status?.status === "BLOCKED" ? (
              <DropdownMenuItem onClick={() => handleAction("UNBLOCK")}>
                <Ban className="h-4 w-4 mr-2" />
                Unblock
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => handleAction("BLOCK")}>
                <Ban className="h-4 w-4 mr-2" />
                Block
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
