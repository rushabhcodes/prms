import { FlaskConical } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function DemoModeBanner() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-dashed border-amber-300 bg-amber-50/90 px-4 py-3 text-sm text-amber-900">
      <FlaskConical className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">Demo mode is active.</span>
          <Badge variant="warning">No Supabase env</Badge>
        </div>
        <p>
          The UI is fully wired, but actions use sample data until you add the
          Supabase environment variables and run the SQL schema.
        </p>
      </div>
    </div>
  );
}
