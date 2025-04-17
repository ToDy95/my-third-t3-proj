"use client";
import { type serverApi } from "@/trpc/server";
import { clientApi } from "@/trpc/react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const DashboardView = ({
  initialData,
}: {
  initialData: Awaited<
    ReturnType<(typeof serverApi)["user"]["getInactiveUsers"]>
  >;
}) => {
  const inactiveUsers = clientApi.user.getInactiveUsers.useQuery(undefined, {
    initialData,
    refetchOnMount: true,
    refetchInterval: 2000,
  });

  const activateUser = clientApi.user.activateUser.useMutation();

  if (inactiveUsers.isLoading) {
    return <div>Loading...</div>;
  }

  const users = inactiveUsers.data;

  return (
    <Table>
      <TableCaption>List of inactive users</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Activate</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.phoneNumber}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              <Button
                variant="ghost"
                onClick={async () => {
                  await activateUser.mutateAsync({ id: user.id });
                  await inactiveUsers.refetch();
                }}
                disabled={activateUser.isPending}
              >
                {activateUser.isPending ? "Activating..." : "Activate Account"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export { DashboardView };
