import { Bell, MessageSquare, Settings } from "lucide-react";
import { Link } from "wouter";

export function ManagerTopbar() {
  return (
    <div className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Budget Storage Florida - Fort Meade</span>
        <span className="text-sm text-muted-foreground">Facility (D.8451)</span>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/manager/messaging">
          <a className="p-2 rounded-full hover:bg-accent">
            <MessageSquare className="h-5 w-5" />
          </a>
        </Link>
        <button className="p-2 rounded-full hover:bg-accent">
          <Bell className="h-5 w-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-accent">
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
