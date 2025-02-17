import { ManagerLayout } from "@/components/manager-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Settings, History, GitFork } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function GatePage() {
  // Temporary mock data until we add the schema and API
  const mockGateLogs = [
    { id: 1, userId: 1, userName: "John Doe", accessType: "entry", timestamp: new Date(), unitNumber: "A101" },
    { id: 2, userId: 2, userName: "Jane Smith", accessType: "exit", timestamp: new Date(Date.now() - 3600000), unitNumber: "B205" },
  ];

  const mockGateSettings = {
    isEnabled: true,
    openTime: "06:00",
    closeTime: "22:00",
    requireCodeAfterHours: true,
    allowManagerOverride: true,
  };

  return (
    <ManagerLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <GitFork className="h-6 w-6" />
            <div>
              <h1 className="text-3xl font-bold">Gate Management</h1>
              <p className="text-muted-foreground">
                Monitor gate access and manage settings
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Gate Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Gate Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Gate System</p>
                    <p className="text-sm text-muted-foreground">Enable or disable the gate system</p>
                  </div>
                  <Switch checked={mockGateSettings.isEnabled} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Operating Hours</p>
                    <p className="text-sm text-muted-foreground">Set gate operating hours</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">{mockGateSettings.openTime}</Button>
                    <Button variant="outline" size="sm">{mockGateSettings.closeTime}</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">After Hours Access</p>
                    <p className="text-sm text-muted-foreground">Require access code after hours</p>
                  </div>
                  <Switch checked={mockGateSettings.requireCodeAfterHours} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Manager Override</p>
                    <p className="text-sm text-muted-foreground">Allow managers to override gate controls</p>
                  </div>
                  <Switch checked={mockGateSettings.allowManagerOverride} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Access Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Access Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockGateLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{format(log.timestamp, 'HH:mm:ss')}</TableCell>
                      <TableCell>{log.userName}</TableCell>
                      <TableCell>{log.unitNumber}</TableCell>
                      <TableCell>
                        <Badge variant={log.accessType === 'entry' ? 'default' : 'secondary'}>
                          {log.accessType}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </ManagerLayout>
  );
}
