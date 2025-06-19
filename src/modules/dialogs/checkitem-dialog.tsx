import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { IChecklistItem } from "@/types/construct-task";
import { editChecklistItemSchema } from "@/schemas/edit-schemas";
import React from "react";
import { Button } from "@/components/ui/button";

interface CheckItemDialogProps {
  onSubmit: (data: z.infer<typeof editChecklistItemSchema>) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: IChecklistItem;
}

export function CheckItemDialog({ onSubmit, open, onOpenChange, data }: CheckItemDialogProps) {
  const form = useForm({
    resolver: zodResolver(editChecklistItemSchema),
    defaultValues: {
      checklistItemName: data?.name || "",
      checklistItemDescription: data?.description || "",
      checklistItemStatus: data?.status?.id || "not-started",
      checklistItemStatusName: data?.status?.name || "Not Started",
    },
  });

  // Reset form when data changes
  React.useEffect(() => {
    if (data) {
      form.reset({
        checklistItemName: data.name || "",
        checklistItemDescription: data.description || "",
        checklistItemStatus: data.status?.id || "not-started",
        checklistItemStatusName: data.status?.name || "Not Started",
      });
    }
  }, [data]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>Check Item</DialogTitle>
            </DialogHeader>

            <FormField
              control={form.control}
              name="checklistItemName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="checklistItemDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="checklistItemStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-started">Not Started</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="final-check">Final Check</SelectItem>
                        <SelectItem value="awaiting">Awaiting</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="checklistItemStatusName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Status Name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
