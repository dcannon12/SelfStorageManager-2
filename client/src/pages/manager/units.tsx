import { ManagerLayout } from "@/components/manager-layout";
import { useQuery } from "@tanstack/react-query";
import { Unit } from "@shared/schema";
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
import { Search, Filter as FilterIcon, Edit as EditIcon, Trash as TrashIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UnitDialog } from "@/components/dialogs/unit-dialog";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function UnitsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: units, isLoading } = useQuery<Unit[]>({
    queryKey: ["/api/units"],
    queryFn: async () => {
      const response = await fetch("/api/units");
      if (!response.ok) throw new Error("Failed to fetch units");
      return response.json();
    }
  });

  const [searchTerm, setSearchTerm] = useState("");

  const filteredUnits = units?.filter(unit => 
    unit.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.size.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateUnitStatus = useMutation({
    mutationFn: async ({ id, isOccupied }: { id: number; isOccupied: boolean }) => {
      const response = await fetch(`/api/units/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isOccupied }),
      });
      if (!response.ok) throw new Error("Failed to update unit status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/units"] });
      toast({
        title: "Success",
        description: "Unit status updated successfully",
      });
    },
  });

  const deleteUnit = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/units/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete unit");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/units"] });
      toast({
        title: "Success",
        description: "Unit deleted successfully",
      });
    },
  });

  return (
    <ManagerLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Storage Units</h1>
        <UnitDialog />
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search units by location, type, or size..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <FilterIcon className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredUnits?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No units found
                </TableCell>
              </TableRow>
            ) : (
              filteredUnits?.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell>{unit.id}</TableCell>
                  <TableCell className="capitalize">{unit.type}</TableCell>
                  <TableCell>{unit.size}</TableCell>
                  <TableCell>{unit.location}</TableCell>
                  <TableCell>${unit.price}/month</TableCell>
                  <TableCell>
                    <Badge 
                      variant={unit.isOccupied ? "destructive" : "secondary"}
                      className="whitespace-nowrap cursor-pointer"
                      onClick={() => 
                        updateUnitStatus.mutate({
                          id: unit.id,
                          isOccupied: !unit.isOccupied,
                        })
                      }
                    >
                      {unit.isOccupied ? "Occupied" : "Available"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <EditIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {}}>
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            updateUnitStatus.mutate({
                              id: unit.id,
                              isOccupied: !unit.isOccupied,
                            })
                          }
                        >
                          Change Status
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {}}>
                          View History
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => deleteUnit.mutate(unit.id)}
                        >
                          Delete Unit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </ManagerLayout>
  );
}