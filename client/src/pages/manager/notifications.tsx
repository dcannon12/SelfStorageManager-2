import { useState } from "react";
import { ManagerLayout } from "@/components/manager-layout";
import { useQuery } from "@tanstack/react-query";
import { NotificationTemplate } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Mail, MessageSquare } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function NotificationsPage() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [triggerFilter, setTriggerFilter] = useState<string>("all");

  const { data: templates } = useQuery<NotificationTemplate[]>({
    queryKey: ["/api/notification-templates"],
  });

  // Apply filters
  const filteredTemplates = templates?.filter((template) => {
    const matchesType = typeFilter === "all" || template.type === typeFilter;
    const matchesTrigger = triggerFilter === "all" || template.trigger === triggerFilter;
    return matchesType && matchesTrigger;
  }) ?? [];

  const triggerLabels: Record<string, string> = {
    payment_late: "Payment Late",
    payment_due: "Payment Due",
    lien_warning: "Lien Warning",
    lien_filed: "Lien Filed",
    custom: "Custom Trigger"
  };

  return (
    <ManagerLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Notification Templates</h1>
            <p className="text-muted-foreground">
              Manage email and SMS notification templates
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Template
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center gap-4">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Template Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
            </SelectContent>
          </Select>

          <Select value={triggerFilter} onValueChange={setTriggerFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trigger Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Triggers</SelectItem>
              <SelectItem value="payment_late">Payment Late</SelectItem>
              <SelectItem value="payment_due">Payment Due</SelectItem>
              <SelectItem value="lien_warning">Lien Warning</SelectItem>
              <SelectItem value="lien_filed">Lien Filed</SelectItem>
              <SelectItem value="custom">Custom Trigger</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>{template.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex w-fit items-center gap-2">
                      {template.type === "email" ? (
                        <Mail className="h-3 w-3" />
                      ) : (
                        <MessageSquare className="h-3 w-3" />
                      )}
                      {template.type === "email" ? "Email" : "SMS"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {triggerLabels[template.trigger]}
                  </TableCell>
                  <TableCell>
                    <Badge variant={template.isActive ? "default" : "secondary"}>
                      {template.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={template.isActive}
                      onCheckedChange={() => {
                        // TODO: Implement toggle functionality
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ManagerLayout>
  );
}
