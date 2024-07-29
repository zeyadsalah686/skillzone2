"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RANGE_OPTIONS } from "@/lib/rangeOptions";
import { subDays } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useState } from "react";
import { DateRange } from "react-day-picker";

type ChartCardProps = {
    title: string;
    queryKey: string;
    selectedRangeLabel: string;
    children: ReactNode;
};

export function ChartCard({
    title,
    children,
    queryKey,
    selectedRangeLabel,
}: ChartCardProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    function setRange(range: keyof typeof RANGE_OPTIONS | DateRange) {
        const params = new URLSearchParams(searchParams);
        if (typeof range === "string") {
            params.set(queryKey, range);
            params.delete(`${queryKey}From`);
            params.delete(`${queryKey}To`);
        } else {
            if (range.from == null || range.to == null) return;
            params.delete(queryKey);
            params.set(`${queryKey}From`, range.from.toISOString());
            params.set(`${queryKey}To`, range.to.toISOString());
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }

    return (
        <Card>
            <CardHeader className="p-4">
                <div className="flex gap-4 justify-between items-center">
                    <CardTitle className="text-primary">{title}</CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="text-primary hover:text-white
                        ">
                                {selectedRangeLabel}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {Object.entries(RANGE_OPTIONS).map(
                                ([key, value]) => (
                                    <DropdownMenuItem
                                        onClick={() =>
                                            setRange(
                                                key as keyof typeof RANGE_OPTIONS
                                            )
                                        }
                                        key={key}
                                    >
                                        {value.label}
                                    </DropdownMenuItem>
                                )
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="p-1">{children}</CardContent>
        </Card>
    );
}
