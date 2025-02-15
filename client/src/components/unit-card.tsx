import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Unit } from "@shared/schema";
import { useLocation } from "wouter";

interface UnitCardProps {
  unit: Unit;
}

export function UnitCard({ unit }: UnitCardProps) {
  const [, setLocation] = useLocation();
  const unitTypeImage = {
    small: "https://images.unsplash.com/photo-1465779042638-3e4bfcc3475d",
    medium: "https://images.unsplash.com/photo-1719937051128-d2d7ccd7853c",
    large: "https://images.unsplash.com/photo-1576669801820-a9ab287ac2d1",
    "extra-large": "https://images.unsplash.com/photo-1719937050988-dd510cf0e512"
  }[unit.type];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="aspect-video w-full relative">
          <img
            src={unitTypeImage}
            alt={`${unit.type} storage unit`}
            className="object-cover w-full h-full"
          />
          <Badge 
            variant={unit.isOccupied ? "destructive" : "secondary"}
            className="absolute top-2 right-2"
          >
            {unit.isOccupied ? "Occupied" : "Available"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold capitalize mb-2">{unit.type} Unit</h3>
        <p className="text-sm text-muted-foreground">Size: {unit.size}</p>
        <p className="text-sm text-muted-foreground">Location: {unit.location}</p>
        <p className="font-medium mt-2">${unit.price}/month</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          disabled={unit.isOccupied}
          onClick={() => setLocation(`/book/${unit.id}`)}
        >
          {unit.isOccupied ? "Not Available" : "Book Now"}
        </Button>
      </CardFooter>
    </Card>
  );
}