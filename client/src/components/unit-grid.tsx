import { type Unit } from "@shared/schema";
import { UnitCard } from "./unit-card";

interface UnitGridProps {
  units: Unit[];
}

export function UnitGrid({ units }: UnitGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {units.map((unit) => (
        <UnitCard key={unit.id} unit={unit} />
      ))}
    </div>
  );
}
