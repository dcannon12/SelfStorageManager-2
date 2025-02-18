import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddLockDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddLockDialog({ isOpen, onClose }: AddLockDialogProps) {
  const [serialCode, setSerialCode] = useState("");
  const [combination, setCombination] = useState("");
  const [facility, setFacility] = useState("");
  const [status, setStatus] = useState("Available");

  const handleSave = () => {
    // TODO: Implement save functionality
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Lock</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <label className="text-base font-medium">Serial code</label>
            <Input
              value={serialCode}
              onChange={(e) => setSerialCode(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <label className="text-base font-medium">Combination</label>
            <Input
              value={combination}
              onChange={(e) => setCombination(e.target.value)}
              className="mt-2"
            />
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-base font-medium">Facility</label>
                <Select value={facility} onValueChange={setFacility}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select facility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bronson">Bronson Self Storage</SelectItem>
                    {/* Add more facilities as needed */}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-base font-medium">Lock is</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Locked">Locked</SelectItem>
                    <SelectItem value="On vacant unit">On vacant unit</SelectItem>
                    <SelectItem value="Overlocked">Overlocked</SelectItem>
                    <SelectItem value="Remove lock">Remove lock</SelectItem>
                    <SelectItem value="Locked for auction">Locked for auction</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
