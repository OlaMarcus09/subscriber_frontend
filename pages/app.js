// ... (previous imports remain the same)
import { BarChart3 } from 'lucide-react';

// ... (inside the component, update the QuickAction section)

{/* --- Quick Actions --- */}
<div className="mb-6">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-lg font-bold text-white">Quick Actions</h2>
    <Sparkles className="w-4 h-4 text-purple-400" />
  </div>
  
  <div className="grid grid-cols-1 gap-3">
    <QuickAction
      icon={<QrCode className="w-5 h-5" />}
      title="Show Check-In Key"
      description="Generate your digital access code"
      action="/checkin"
      color="purple"
    />
    <QuickAction
      icon={<Building2 className="w-5 h-5" />}
      title="Browse Spaces"
      description="Find workspaces near you"
      action="/spaces"
      color="blue"
    />
    <QuickAction
      icon={<BarChart3 className="w-5 h-5" />}
      title="View Analytics"
      description="Track your usage patterns"
      action="/analytics"
      color="green"
    />
    <QuickAction
      icon={<Calendar className="w-5 h-5" />}
      title="My Plan & Usage"
      description="View subscription details"
      action="/profile"
      color="yellow"
    />
  </div>
</div>
