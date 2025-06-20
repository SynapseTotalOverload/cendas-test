import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { IConstructTask } from "@/types/construct-task";
import { editTaskSchema } from "@/schemas/edit-schemas";
import React from "react";
import { Button } from "@/components/ui/button";
import { getTaskIcon } from "@/lib/helpers";

interface TaskDialogProps {
  onSubmit: (data: z.infer<typeof editTaskSchema>) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: IConstructTask;
}

export function TaskDialog({ onSubmit, open, onOpenChange, data }: TaskDialogProps) {
  const form = useForm({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      taskName: data?.name || "",
      taskDescription: data?.description || "",
      taskStatus: data?.status || "pending",
      taskIconID: data?.iconID || "other",
      taskCoordinatesX: data?.coordinates?.x || 0,
      taskCoordinatesY: data?.coordinates?.y || 0,
    },
  });

  // Reset form when data changes
  React.useEffect(() => {
    if (data) {
      form.reset({
        taskName: data.name || "",
        taskDescription: data.description || "",
        taskStatus: data.status || "pending",
        taskIconID: data.iconID || "other",
        taskCoordinatesX: data.coordinates?.x || 0,
        taskCoordinatesY: data.coordinates?.y || 0,
      });
    }
  }, [data, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>

            <FormField
              control={form.control}
              name="taskName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taskDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taskStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="awaiting">Awaiting</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taskIconID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon Type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an icon type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lampwork">
                          <div className="flex items-center gap-2">{getTaskIcon("lampwork")} Lampwork</div>
                        </SelectItem>
                        <SelectItem value="lighting">
                          <div className="flex items-center gap-2">{getTaskIcon("lighting")} Lighting</div>
                        </SelectItem>
                        <SelectItem value="electrical">
                          <div className="flex items-center gap-2">{getTaskIcon("electrical")} Electrical</div>
                        </SelectItem>
                        <SelectItem value="plumbing">
                          <div className="flex items-center gap-2">{getTaskIcon("plumbing")} Plumbing</div>
                        </SelectItem>
                        <SelectItem value="painting">
                          <div className="flex items-center gap-2">{getTaskIcon("painting")} Painting</div>
                        </SelectItem>
                        <SelectItem value="carpentry">
                          <div className="flex items-center gap-2">{getTaskIcon("carpentry")} Carpentry</div>
                        </SelectItem>
                        <SelectItem value="masonry">
                          <div className="flex items-center gap-2">{getTaskIcon("masonry")} Masonry</div>
                        </SelectItem>
                        <SelectItem value="flooring">
                          <div className="flex items-center gap-2">{getTaskIcon("flooring")} Flooring</div>
                        </SelectItem>

                        <SelectItem value="other">
                          <div className="flex items-center gap-2">{getTaskIcon("other")} Other</div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="taskCoordinatesX"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>X Coordinate</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="X position"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taskCoordinatesY"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Y Coordinate</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Y position"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
