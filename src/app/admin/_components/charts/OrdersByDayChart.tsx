"use client";

import { formatCurrency } from "@/lib/formatters";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type OrdersByDayChartProps = {
    data: {
        date: string;
        totalSales: number;
    }[];
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        console.log("Tooltip payload:", payload);
        return (
            <div className="custom-tooltip bg-white p-4 border border-gray-300 rounded">
                <p className="label text-[#3182BD]">{`Date: ${label}`}</p>
                <p className="intro text-[#3182BD]">{`Total Sales: ${formatCurrency(
                    payload[0].value
                )}`}</p>
            </div>
        );
    }

    return null;
};

export function OrdersByDayChart({ data }: OrdersByDayChartProps) {
    return (
        <ResponsiveContainer width="100%" minHeight={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(tick) => formatCurrency(tick)} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                    dot={false}
                    dataKey="totalSales"
                    type="monotone"
                    name="Total Sales"
                />
            </LineChart>
        </ResponsiveContainer>
    );
}