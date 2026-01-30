import { useState } from 'react';
import { 
  Users, 
  RotateCcw, 
  CheckCircle, 
  Layers, 
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  ArrowRight,
  Calendar
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '@/lib/utils';
import { 
  mockDashboardMetrics, 
  mockActionItems, 
  mockActiveCycleSummary,
  mockPerformanceTrends 
} from '@/data/mockData';
import type { ActionItem } from '@/types';

// KPI Card Component
interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: React.ElementType;
  color: 'teal' | 'orange' | 'blue' | 'purple';
}

function KPICard({ title, value, subtitle, trend, trendValue, icon: Icon, color }: KPICardProps) {
  const colorClasses = {
    teal: 'bg-teal/10 text-teal',
    orange: 'bg-orange/10 text-orange',
    blue: 'bg-info/10 text-info',
    purple: 'bg-purple-500/10 text-purple-500',
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-teal' : trend === 'down' ? 'text-red' : 'text-slate';

  return (
    <div className="bg-white rounded-lg border border-[#e5e5e5] p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate">{title}</p>
          <p className="text-2xl font-semibold text-charcoal mt-1">{value}</p>
          {subtitle && <p className="text-xs text-slate mt-1">{subtitle}</p>}
          {trend && trendValue && (
            <div className={cn("flex items-center gap-1 mt-2", trendColor)}>
              <TrendIcon className="w-3 h-3" />
              <span className="text-xs font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colorClasses[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

// Action Item Component
function ActionItemCard({ item }: { item: ActionItem }) {
  const priorityColors = {
    high: 'bg-red/10 text-red border-red/20',
    medium: 'bg-orange/10 text-orange border-orange/20',
    low: 'bg-slate/10 text-slate border-slate/20',
  };

  const typeIcons = {
    cycle: RotateCcw,
    evaluation: CheckCircle,
    configuration: Layers,
  };

  const Icon = typeIcons[item.type];

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-[#e5e5e5] hover:bg-gray-50 transition-colors">
      <div className="w-8 h-8 bg-yellow-accent/50 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-charcoal" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-charcoal">{item.title}</p>
          <span className={cn("text-[10px] px-1.5 py-0.5 rounded border", priorityColors[item.priority])}>
            {item.priority}
          </span>
        </div>
        <p className="text-xs text-slate mt-0.5">{item.description}</p>
        {item.dueDate && (
          <div className="flex items-center gap-1 mt-1.5 text-xs text-slate">
            <Calendar className="w-3 h-3" />
            Due {new Date(item.dueDate).toLocaleDateString()}
          </div>
        )}
      </div>
      <button className="p-1.5 text-slate hover:text-charcoal hover:bg-gray-100 rounded transition-colors">
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// Performance Chart Component
function PerformanceChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mockPerformanceTrends}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis 
            dataKey="cycle" 
            tick={{ fontSize: 12, fill: '#626C7C' }}
            axisLine={{ stroke: '#e5e5e5' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#626C7C' }}
            axisLine={{ stroke: '#e5e5e5' }}
            domain={[0, 10]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Line type="monotone" dataKey="average" stroke="#208C8D" strokeWidth={2} dot={{ fill: '#208C8D' }} name="Average" />
          <Line type="monotone" dataKey="top" stroke="#262828" strokeWidth={2} dot={{ fill: '#262828' }} name="Top Performer" />
          <Line type="monotone" dataKey="bottom" stroke="#A84D2F" strokeWidth={2} dot={{ fill: '#A84D2F' }} name="Bottom Performer" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Department Distribution Chart
function DepartmentChart() {
  const data = [
    { name: 'Sales', value: 24, color: '#208C8D' },
    { name: 'Engineering', value: 35, color: '#262828' },
    { name: 'Marketing', value: 12, color: '#A84D2F' },
    { name: 'HR', value: 8, color: '#2181A4' },
    { name: 'Finance', value: 10, color: '#626C7C' },
    { name: 'Operations', value: 18, color: '#F9A825' },
  ];

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-slate">{item.name} ({item.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Active Cycle Card
function ActiveCycleCard() {
  const cycle = mockActiveCycleSummary;
  const progress = (cycle.completedCount / cycle.participantCount) * 100;

  return (
    <div className="bg-white rounded-lg border border-[#e5e5e5] p-5 shadow-card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-teal" />
            <span className="text-xs font-medium text-teal uppercase tracking-wide">Active Cycle</span>
          </div>
          <h3 className="text-lg font-semibold text-charcoal mt-1">{cycle.name}</h3>
        </div>
        <span className="px-2 py-1 bg-teal/10 text-teal text-xs font-medium rounded">
          {cycle.status}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-slate">Progress</span>
            <span className="font-medium text-charcoal">{cycle.completedCount}/{cycle.participantCount} evaluated</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-teal rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5 text-slate">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(cycle.startDate).toLocaleDateString()} - {new Date(cycle.endDate).toLocaleDateString()}</span>
          </div>
        </div>

        <button className="w-full mt-2 py-2 bg-yellow-accent hover:bg-yellow-accent/80 text-charcoal text-sm font-medium rounded-md transition-colors">
          Continue Evaluation
        </button>
      </div>
    </div>
  );
}

// Main Dashboard Component
export function Dashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-charcoal">Dashboard</h1>
          <p className="text-sm text-slate mt-1">Overview of your performance evaluation system</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#e5e5e5] rounded-lg p-1">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md transition-colors",
                timeRange === range 
                  ? "bg-charcoal text-white" 
                  : "text-slate hover:bg-gray-50"
              )}
            >
              {range === '7d' ? '7 days' : range === '30d' ? '30 days' : range === '90d' ? '90 days' : '1 year'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Employees"
          value={mockDashboardMetrics.totalEmployees}
          subtitle={`${mockDashboardMetrics.activeEmployees} active, ${mockDashboardMetrics.inactiveEmployees} inactive`}
          trend="up"
          trendValue="+5 this month"
          icon={Users}
          color="teal"
        />
        <KPICard
          title="Active Cycles"
          value={mockDashboardMetrics.activeCycles}
          subtitle="1 cycle in progress"
          icon={RotateCcw}
          color="orange"
        />
        <KPICard
          title="Evaluations"
          value={`${mockDashboardMetrics.completedEvaluations}/${mockDashboardMetrics.completedEvaluations + mockDashboardMetrics.pendingEvaluations}`}
          subtitle={`${mockDashboardMetrics.pendingEvaluations} pending`}
          trend="up"
          trendValue="67% completion"
          icon={CheckCircle}
          color="blue"
        />
        <KPICard
          title="Frameworks"
          value={mockDashboardMetrics.totalFrameworks}
          subtitle={`${mockDashboardMetrics.totalIndicators} total indicators`}
          icon={Layers}
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Trends */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-[#e5e5e5] p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-charcoal">Performance Trends</h3>
              <p className="text-sm text-slate">Average scores across evaluation cycles</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-teal" />
                <span className="text-slate">Average</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-charcoal" />
                <span className="text-slate">Top</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-orange" />
                <span className="text-slate">Bottom</span>
              </div>
            </div>
          </div>
          <PerformanceChart />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Active Cycle */}
          <ActiveCycleCard />

          {/* Department Distribution */}
          <div className="bg-white rounded-lg border border-[#e5e5e5] p-5 shadow-card">
            <h3 className="text-lg font-semibold text-charcoal mb-4">Department Distribution</h3>
            <DepartmentChart />
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-white rounded-lg border border-[#e5e5e5] p-5 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange" />
            <h3 className="text-lg font-semibold text-charcoal">Action Items</h3>
          </div>
          <span className="text-sm text-slate">{mockActionItems.length} pending</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {mockActionItems.map((item) => (
            <ActionItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
