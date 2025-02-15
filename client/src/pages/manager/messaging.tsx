import { ManagerLayout } from "@/components/manager-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Customer } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { MessageSquare, Users } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

export default function MessagingPage() {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [selectedTenants, setSelectedTenants] = useState<number[]>([]);

  const { data: tenants } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const handleMassMessage = async () => {
    try {
      const response = await fetch("/api/messages/mass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) throw new Error("Failed to send mass message");
      
      toast({
        title: "Success",
        description: "Message sent to all tenants",
      });
      setMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleSelectMessage = async () => {
    try {
      const response = await fetch("/api/messages/select", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message,
          tenantIds: selectedTenants 
        }),
      });
      
      if (!response.ok) throw new Error("Failed to send messages");
      
      toast({
        title: "Success",
        description: "Messages sent to selected tenants",
      });
      setMessage("");
      setSelectedTenants([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send messages",
        variant: "destructive",
      });
    }
  };

  return (
    <ManagerLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Tenant Messaging</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Mass Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Type your message to all tenants..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button 
                  onClick={handleMassMessage}
                  className="w-full"
                  disabled={!message}
                >
                  Send to All Tenants
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Select Tenants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tenants?.map((tenant) => (
                        <TableRow key={tenant.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedTenants.includes(tenant.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedTenants([...selectedTenants, tenant.id]);
                                } else {
                                  setSelectedTenants(selectedTenants.filter(id => id !== tenant.id));
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>{tenant.name}</TableCell>
                          <TableCell>{tenant.email}</TableCell>
                          <TableCell>{tenant.phone}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Textarea
                  placeholder="Type your message to selected tenants..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button 
                  onClick={handleSelectMessage}
                  className="w-full"
                  disabled={!message || selectedTenants.length === 0}
                >
                  Send to Selected Tenants
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ManagerLayout>
  );
}
