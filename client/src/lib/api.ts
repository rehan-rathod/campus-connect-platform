import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE = "/api";

export const useGetEvents = (status?: string) => {
  return useQuery({
    queryKey: ["events", status],
    queryFn: async () => {
      const url = status ? `${API_BASE}/events?status=${status}` : `${API_BASE}/events`;
      const res = await fetch(url);
      return res.json();
    },
  });
};

export const useGetEvent = (id: string) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/events/${id}`);
      return res.json();
    },
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`${API_BASE}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useUpdateEventStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`${API_BASE}/events/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useRegisterEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ eventId, userId }: { eventId: string; userId: string }) => {
      const res = await fetch(`${API_BASE}/events/${eventId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["activities"] });
    },
  });
};

export const useGetActivities = () => {
  return useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/activities?limit=10`);
      return res.json();
    },
  });
};

export const useGetAnalytics = () => {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/analytics/events`);
      return res.json();
    },
  });
};
