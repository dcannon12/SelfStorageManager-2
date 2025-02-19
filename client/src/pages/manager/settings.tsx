import { ManagerLayout } from "@/components/manager-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import {
  Users,
  FileSpreadsheet,
  Library,
  FileText,
  Tags,
  TrendingUp,
  ArrowUpRight,
  FileStack,
  Mail,
  MessageSquare,
  Edit,
} from "lucide-react";

const securitySettingsSchema = z.object({
  requireTwoFactor: z.boolean(),
  sessionTimeout: z.number().min(5).max(1440),
  passwordExpiration: z.number().min(30).max(365),
});

const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  paymentReminders: z.boolean(),
  maintenanceAlerts: z.boolean(),
});

export default function SettingsPage() {
  const { toast } = useToast();

  const securityForm = useForm({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      requireTwoFactor: false,
      sessionTimeout: 30,
      passwordExpiration: 90,
    },
  });

  const notificationForm = useForm({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      paymentReminders: true,
      maintenanceAlerts: true,
    },
  });

  return (
    <ManagerLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your system settings and preferences
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="w-full justify-start h-auto flex-wrap gap-2 bg-transparent p-0">
            <div className="w-full">
              <h2 className="text-sm font-semibold mb-2 text-muted-foreground">GENERAL</h2>
              <div className="space-y-1">
                <TabsTrigger value="user-management" className="w-full justify-start gap-2">
                  <Users className="h-4 w-4" />
                  User management
                </TabsTrigger>
                <TabsTrigger value="ledger-mapping" className="w-full justify-start gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  General ledger mapping
                </TabsTrigger>
                <TabsTrigger value="fee-library" className="w-full justify-start gap-2">
                  <Library className="h-4 w-4" />
                  Fee library
                </TabsTrigger>
                <TabsTrigger value="lease-config" className="w-full justify-start gap-2">
                  <FileText className="h-4 w-4" />
                  Lease configurations
                </TabsTrigger>
              </div>
            </div>

            <div className="w-full mt-4">
              <h2 className="text-sm font-semibold mb-2 text-muted-foreground">PRICING</h2>
              <div className="space-y-1">
                <TabsTrigger value="pricing-strategies" className="w-full justify-start gap-2">
                  <Tags className="h-4 w-4" />
                  Pricing strategies
                </TabsTrigger>
                <TabsTrigger value="value-pricing" className="w-full justify-start gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Value pricing
                </TabsTrigger>
                <TabsTrigger value="rate-increase" className="w-full justify-start gap-2">
                  <ArrowUpRight className="h-4 w-4" />
                  Rate increase plans
                </TabsTrigger>
              </div>
            </div>

            <div className="w-full mt-4">
              <h2 className="text-sm font-semibold mb-2 text-muted-foreground">COMMUNICATION</h2>
              <div className="space-y-1">
                <TabsTrigger value="document-templates" className="w-full justify-start gap-2">
                  <FileStack className="h-4 w-4" />
                  Document templates
                </TabsTrigger>
                <TabsTrigger value="email-config" className="w-full justify-start gap-2">
                  <Mail className="h-4 w-4" />
                  Email configurations
                </TabsTrigger>
                <TabsTrigger value="system-messages" className="w-full justify-start gap-2">
                  <MessageSquare className="h-4 w-4" />
                  System messages
                </TabsTrigger>
                <TabsTrigger value="custom-messages" className="w-full justify-start gap-2">
                  <Edit className="h-4 w-4" />
                  Custom messages
                </TabsTrigger>
              </div>
            </div>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="access">User Access</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* Content sections */}
          <TabsContent value="user-management">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">User Management</h3>
              <div className="space-y-4">
                <Button variant="outline">Add New User</Button>
                {/* User list and management interface will go here */}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="ledger-mapping">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">General Ledger Mapping</h3>
              {/* Ledger mapping interface will go here */}
            </Card>
          </TabsContent>

          <TabsContent value="fee-library">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Fee Library</h3>
              {/* Fee management interface will go here */}
            </Card>
          </TabsContent>
          <TabsContent value="lease-config">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Lease Configurations</h3>
              {/* Lease Configurations interface will go here */}
            </Card>
          </TabsContent>
          <TabsContent value="pricing-strategies">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Pricing Strategies</h3>
              {/* Pricing Strategies interface will go here */}
            </Card>
          </TabsContent>
          <TabsContent value="value-pricing">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Value Pricing</h3>
              {/* Value Pricing interface will go here */}
            </Card>
          </TabsContent>
          <TabsContent value="rate-increase">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Rate Increase Plans</h3>
              {/* Rate Increase Plans interface will go here */}
            </Card>
          </TabsContent>
          <TabsContent value="document-templates">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Document Templates</h3>
              {/* Document Templates interface will go here */}
            </Card>
          </TabsContent>
          <TabsContent value="email-config">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Email Configurations</h3>
              {/* Email Configurations interface will go here */}
            </Card>
          </TabsContent>
          <TabsContent value="system-messages">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">System Messages</h3>
              {/* System Messages interface will go here */}
            </Card>
          </TabsContent>
          <TabsContent value="custom-messages">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Custom Messages</h3>
              {/* Custom Messages interface will go here */}
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="p-6">
              <Form {...securityForm}>
                <form className="space-y-6">
                  <FormField
                    control={securityForm.control}
                    name="requireTwoFactor"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Two-Factor Authentication
                          </FormLabel>
                          <FormDescription>
                            Require 2FA for all staff accounts
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={securityForm.control}
                      name="sessionTimeout"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Session Timeout (minutes)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Automatically log out after inactivity
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={securityForm.control}
                      name="passwordExpiration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password Expiration (days)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormDescription>
                            Days until password must be changed
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit">Save Security Settings</Button>
                </form>
              </Form>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="p-6">
              <Form {...notificationForm}>
                <form className="space-y-6">
                  <FormField
                    control={notificationForm.control}
                    name="emailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Email Notifications
                          </FormLabel>
                          <FormDescription>
                            Receive notifications via email
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={notificationForm.control}
                    name="smsNotifications"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            SMS Notifications
                          </FormLabel>
                          <FormDescription>
                            Receive notifications via SMS
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={notificationForm.control}
                    name="paymentReminders"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Payment Reminders
                          </FormLabel>
                          <FormDescription>
                            Send payment reminder notifications
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={notificationForm.control}
                    name="maintenanceAlerts"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Maintenance Alerts
                          </FormLabel>
                          <FormDescription>
                            Receive facility maintenance notifications
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Save Notification Settings</Button>
                </form>
              </Form>
            </Card>
          </TabsContent>

          <TabsContent value="access">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">User Access Management</h3>
              {/* This section will be implemented with user management features */}
              <p className="text-muted-foreground mb-4">
                Manage user roles and permissions for facility access
              </p>
              <Button variant="outline">Add New User</Button>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">System Configuration</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h4 className="font-medium">Backup Settings</h4>
                    <p className="text-sm text-muted-foreground">
                      Configure automated system backups
                    </p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h4 className="font-medium">API Integration</h4>
                    <p className="text-sm text-muted-foreground">
                      Manage third-party API connections
                    </p>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">System Updates</h4>
                    <p className="text-sm text-muted-foreground">
                      Check and install system updates
                    </p>
                  </div>
                  <Button variant="outline">Check Updates</Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ManagerLayout>
  );
}