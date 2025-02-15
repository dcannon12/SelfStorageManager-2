import { ManagerLayout } from "@/components/manager-layout";
import { useQuery } from "@tanstack/react-query";
import { PricingGroup } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PricingPage() {
  const { data: groups } = useQuery<PricingGroup[]>({
    queryKey: ["/api/pricing-groups"],
  });

  return (
    <ManagerLayout>
      <h1 className="text-3xl font-bold mb-8">Pricing Groups</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price Multiplier</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups?.map((group) => (
              <TableRow key={group.id}>
                <TableCell>{group.name}</TableCell>
                <TableCell>{group.description}</TableCell>
                <TableCell>×{group.multiplier}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ManagerLayout>
  );
}
