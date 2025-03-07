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
import { Settings, History, GitFork, Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useState } from "react";
import { Input } from "@/components/ui/input";

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

  const [gateName, setGateName] = useState("Fort Meade");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ManagerLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <GitFork className="h-6 w-6" />
            <div>
              <h1 className="text-3xl font-bold">Gate Access Control</h1>
              <p className="text-muted-foreground">
                Monitor gate access and manage settings
              </p>
            </div>
          </div>
        </div>

        {/* SMS Access Instructions */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-muted-foreground mb-2">
              Active customers with a recognized phone number can open the gate by texting "open" to
            </p>
            <p className="text-lg font-semibold text-primary">(863) 485-6790</p>
            <p className="text-sm text-muted-foreground mt-4">
              The selected primary gate can be accessed by texting "open" to the Text-to-Open number. 
              All other gates require the Access Name to be specified (e.g. "open entry").
            </p>
          </CardContent>
        </Card>

        {/* Gate Control */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Gate Control</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-sm font-medium">Gate</div>
                <div className="col-span-3">
                  <Input 
                    value={gateName}
                    onChange={(e) => setGateName(e.target.value)}
                    placeholder="Enter gate name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <div className="text-sm font-medium">Access Name</div>
                <div className="col-span-3 flex items-center gap-4">
                  <Input 
                    value={gateName}
                    onChange={(e) => setGateName(e.target.value)}
                    placeholder="Gate access name"
                  />
                  <Button 
                    className="w-24"
                    onClick={() => setIsOpen(true)}
                  >
                    Open
                  </Button>
                  <Button 
                    className="w-24"
                    variant="secondary"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </Button>
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {isOpen ? "Open" : "Closed"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Save</Button>
              </div>
            </div>
          </CardContent>
        </Card>

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