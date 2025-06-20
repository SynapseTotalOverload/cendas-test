import { CollapsibleDataTable } from "@/components/ui/collapsible-data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { IChecklistItem, IConstructTask, TChecklistStatuses } from "@/types/construct-task";

import { getTaskIcon, getTaskStatus, getChecklistStatusColor, statusStyles } from "@/lib/helpers";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { EllipsisVertical } from "lucide-react";

interface ConstructTableViewProps {
  tasks: IConstructTask[];
  handleEdit: (task: IConstructTask) => void;
  handleDelete: (task: IConstructTask) => void;
  handleCheckListEdit: (task: IConstructTask, checklistItem: IChecklistItem) => void;
  handleCheckListDelete: (taskId: string, checklistItem: IChecklistItem) => void;
  handleAddChecklistItem: (task: IConstructTask) => void;
}

export function ConstructTableView({
  tasks,
  handleEdit,
  handleDelete,
  handleCheckListEdit,
  handleCheckListDelete,
  handleAddChecklistItem,
}: ConstructTableViewProps) {
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
      header: "",
      accessorKey: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <EllipsisVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      handleAddChecklistItem(row.original);
                    }}>
                    Add Checklist Item
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      handleEdit(row.original);
                    }}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      handleDelete(row.original);
                    }}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <CollapsibleDataTable
      columns={columns}
      data={tasks}
      renderExpandedContent={row => (
        <div className="bg-gray-50 border-t border-gray-200 p-4">
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Checklist Items ({row.original.checklist.length})
            </h4>
          </div>
          <div className="space-y-2">
            {row.original.checklist.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2 bg-white rounded-md border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex items-center  min-w-0 flex-1 gap-2">
                  <div className="flex-shrink-0">{statusStyles[item.status.id as TChecklistStatuses]?.icon}</div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 truncate">{item.name}</div>
                    <div className="text-xs text-gray-500 truncate">{item.description}</div>
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2">
                  <span
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${getChecklistStatusColor(item.status.id)}20`,
                      color: getChecklistStatusColor(item.status.id),
                    }}>
                    {item.status.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <EllipsisVertical />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuGroup>
                          <DropdownMenuItem
                            onClick={e => {
                              e.stopPropagation();
                              handleCheckListEdit(row.original, item);
                            }}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={e => {
                              e.stopPropagation();
                              handleCheckListDelete(row.original.id, item);
                            }}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
}
