import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CalendarClock } from "lucide-react"

export function NewReminderDialog({ children }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[420px] bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">
            Add New Reminder
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Create a reminder to stay on track.
          </DialogDescription>
        </DialogHeader>

        {/* FORM BODY */}
        <div className="grid gap-4 py-2">
          
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Reminder title</Label>
            <Input
              id="title"
              placeholder="e.g. Daily voice practice"
            />
          </div>

          {/* Date & Time */}
          <div className="grid gap-2">
            <Label htmlFor="datetime">Date & time</Label>
            <div className="relative">
              <CalendarClock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="datetime"
                type="datetime-local"
                className="pl-9"
              />
            </div>
          </div>

          {/* Priority */}
          <div className="grid gap-2">
            <Label htmlFor="priority">Priority</Label>
            <select
              id="priority"
              className="h-10 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              defaultValue="medium"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="flex gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button className="bg-primary text-primary-foreground">
            Add Reminder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
