import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Customer } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface GateAccessDialogProps {
  tenant: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GateAccessDialog({ tenant, open, onOpenChange }: GateAccessDialogProps) {
  const { toast } = useToast();
  const [gateCode, setGateCode] = useState(tenant.accessCode || "");
  const [gateGroup, setGateGroup] = useState("24/7");

  // Placeholder gate groups - these would come from your backend in a real implementation
  const gateGroups = [
    { id: "24/7", name: "24/7 Access" },
    { id: "business", name: "Business Hours (8AM-6PM)" },
    { id: "extended", name: "Extended Hours (6AM-10PM)" },
  ];

  const handleSave = async () => {
    try {
      // TODO: Implement API call to update gate access
      toast({
        title: "Success",
        description: "Gate access settings updated successfully",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update gate access settings",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gate Access Settings - {tenant.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Gate Access Code</h3>
            <Input
              placeholder="Enter gate code"
              value={gateCode}
              onChange={(e) => setGateCode(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Current code: {tenant.accessCode || "Not set"}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Access Group</h3>
            <Select value={gateGroup} onValueChange={setGateGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Select access group" />
              </SelectTrigger>
              <SelectContent>
                {gateGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Determines when the tenant can access the facility
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
