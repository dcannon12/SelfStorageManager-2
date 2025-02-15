import { useQuery } from "@tanstack/react-query";
import { Unit } from "@shared/schema";
import { UnitGrid } from "@/components/unit-grid";
import { Skeleton } from "@/components/ui/skeleton";

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { data: units, isLoading } = useQuery<Unit[]>({
    queryKey: ["/api/units"],
  });

  if (isLoading) return <LoadingSkeleton />;
  if (!units) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Storage Units</h1>
          <p className="text-muted-foreground">
            {units.filter(u => !u.isOccupied).length} units available
          </p>
        </div>
      </div>
      <UnitGrid units={units} />
    </div>
  );
}
