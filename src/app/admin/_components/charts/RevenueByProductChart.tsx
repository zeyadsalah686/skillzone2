"use client";

import { formatCurrency } from "@/lib/formatters";
import { PieChart, Pie, ResponsiveContainer, Tooltip } from "recharts";

type RevenueByProductChartProps = {
    data: {
        name: string;
        revenue: number;
    }[];
};

export function RevenueByProductChart({ data }: RevenueByProductChartProps) {
    return (
        <ResponsiveContainer width="100%" minHeight={300}>
            <PieChart>
                <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                />
                <Pie
                    data={data}
                    label={item => item.name}
                    dataKey="revenue"
                    nameKey="name"
                    fill="#2196F3"
                />
            </PieChart>
        </ResponsiveContainer>
    );
}
