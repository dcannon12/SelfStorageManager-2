import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Customer } from "@shared/schema";
import { Send } from "lucide-react";

interface TenantMessageDialogProps {
  tenant: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TenantMessageDialog({ tenant, open, onOpenChange }: TenantMessageDialogProps) {
  const [message, setMessage] = useState("");

  // Placeholder messages for now
  const messages = [
    { id: 1, text: "Hello, I have a question about my unit.", sender: "tenant", timestamp: "2025-02-17T14:00:00" },
    { id: 2, text: "How can I help you today?", sender: "manager", timestamp: "2025-02-17T14:05:00" },
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // TODO: Implement sending message
    setMessage("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Message {tenant.name}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'manager' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    msg.sender === 'manager'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-xs opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex items-center gap-2 mt-4">
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
