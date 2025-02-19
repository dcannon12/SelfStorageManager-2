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

        <Tabs defaultValue="security" className="space-y-4">
          <TabsList>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="access">User Access</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

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
