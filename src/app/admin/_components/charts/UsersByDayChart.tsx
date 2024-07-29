"use client";

import { formatNumber } from "@/lib/formatters";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type UsersByDayChartProps = {
    data: {
        date: string;
        totalUsers: number;
    }[];
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        console.log("Tooltip payload:", payload);

        return (
            <div className="custom-tooltip bg-white p-4 border border-gray-300 rounded">
                <p className="label text-[#8884d8]">{`Date: ${label}`}</p>
                <p className="label text-[#8884d8]">{`New Customers: ${payload[0].value}`}</p>
            </div>
        );
    }

    return null;
};

export function UsersByDayChart({ data }: UsersByDayChartProps) {
    return (
        <ResponsiveContainer width="100%" minHeight={300}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(tick) => formatNumber(tick)} />
                <Tooltip
                    cursor={{ fill: "hsl(var(--muted))" }}
                    content={<CustomTooltip />}
                />
                <Bar dataKey="totalUsers" name="New Customers" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
}
