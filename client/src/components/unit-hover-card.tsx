import { Customer } from "@shared/schema";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Phone, Mail } from "lucide-react";

interface UnitHoverCardProps {
  children: React.ReactNode;
  tenant?: Customer;
  ongoingSince?: string;
}

export function UnitHoverCard({ children, tenant, ongoingSince }: UnitHoverCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        {tenant ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">{tenant.name}</h4>
              <Badge variant="outline">{tenant.accountStatus}</Badge>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <CalendarDays className="h-4 w-4 mt-0.5" />
              <div>
                <div>Tenant since</div>
                <div className="text-muted-foreground">{ongoingSince}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4" />
              <span>{tenant.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4" />
              <span>{tenant.email}</span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            This unit is currently vacant
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
