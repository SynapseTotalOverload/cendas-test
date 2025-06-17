import { CollapsibleDataTable } from "@/components/ui/collapsible-data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { IConstructTask } from "@/types/construct-task";
import { Badge } from "@/components/ui/badge";
import { getTaskIcon, getTaskStatus } from "@/lib/helpers";
import { taskConstants } from "@/constants/task-constants";

export default function ConstructTableView() {
  const tasks = Object.values(taskConstants);
  const columns: ColumnDef<IConstructTask>[] = [
    {
      header: "Icon",
      accessorKey: "iconID",
      cell: ({ row }) => {
        return <div className="flex items-center gap-2">{getTaskIcon(row.original.iconID)}</div>;
      },
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Description",
      accessorKey: "description",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        return <div className="flex items-center gap-2">{getTaskStatus(row.original.status)}</div>;
      },
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }) => {
        return <div>{new Date(row.original.createdAt).toLocaleDateString()}</div>;
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Construct Tasks</h1>
        <p className="text-sm text-gray-500">This is a list of all the construct tasks in the database.</p>
      </div>
      <CollapsibleDataTable
        columns={columns}
        data={tasks}
        renderExpandedContent={row => <div className="bg-gray-300 p-4">{row.original.description}</div>}
      />
    </div>
  );
}
