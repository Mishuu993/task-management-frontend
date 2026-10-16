"use client";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DashboardChartsProps {
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  totalTasks: number;
}

const STATUS_COLORS = ["#f59e0b", "#3b82f6", "#10b981"];
const PRIORITY_BAR_COLOR = "#7c3aed";

// Custom Pie Label
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  if (percent === 0) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={13}
      fontWeight={700}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function DashboardCharts({
  pendingTasks,
  inProgressTasks,
  completedTasks,
  totalTasks,
}: DashboardChartsProps) {
  const pieData = [
    { name: "Pending", value: pendingTasks },
    { name: "In Progress", value: inProgressTasks },
    { name: "Completed", value: completedTasks },
  ].filter((d) => d.value > 0);

  const barData = [
    { name: "Pending", tasks: pendingTasks },
    { name: "In Progress", tasks: inProgressTasks },
    { name: "Completed", tasks: completedTasks },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Pie Chart — Task Status Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
        <div className="mb-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Task Status Distribution
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Breakdown of all {totalTasks} tasks
          </p>
        </div>
        {totalTasks === 0 ? (
          <div className="flex items-center justify-center h-52 text-gray-400 dark:text-gray-500 text-sm">
            No tasks available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                labelLine={false}
                label={renderCustomLabel}
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  fontSize: "13px",
                }}
                formatter={(value: any) => [`${value} tasks`, ""]}
              />
              <Legend
                formatter={(value) => (
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bar Chart — Task Count by Status */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
        <div className="mb-4">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Tasks by Status
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Count of tasks in each stage
          </p>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={barData}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                fontSize: "13px",
              }}
              formatter={(value: any) => [`${value} tasks`, "Count"]}
            />
            <Bar
              dataKey="tasks"
              fill={PRIORITY_BAR_COLOR}
              radius={[6, 6, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
