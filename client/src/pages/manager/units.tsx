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

export default function UnitsPage() {
  const { data: units } = useQuery<Unit[]>({
    queryKey: ["/api/units"],
  });

  return (
    <ManagerLayout>
      <h1 className="text-3xl font-bold mb-8">Storage Units</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {units?.map((unit) => (
              <TableRow key={unit.id}>
                <TableCell>{unit.id}</TableCell>
                <TableCell className="capitalize">{unit.type}</TableCell>
                <TableCell>{unit.size}</TableCell>
                <TableCell>{unit.location}</TableCell>
                <TableCell>${unit.price}/month</TableCell>
                <TableCell>
                  <Badge variant={unit.isOccupied ? "destructive" : "secondary"}>
                    {unit.isOccupied ? "Occupied" : "Available"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ManagerLayout>
  );
}
