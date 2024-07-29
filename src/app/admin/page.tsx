import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { OrdersByDayChart } from "./_components/charts/OrdersByDayChart";
import { Prisma } from "@prisma/client";
import {
    differenceInDays,
    differenceInMonths,
    eachDayOfInterval,
    eachMonthOfInterval,
    eachWeekOfInterval,
    eachYearOfInterval,
    endOfWeek,
    startOfDay,
} from "date-fns";
import { format } from "date-fns";
import { UsersByDayChart } from "./_components/charts/UsersByDayChart";
import { RevenueByProductChart } from "./_components/charts/RevenueByProductChart";
import { PageHeader } from "./_components/PageHeader";
import { RANGE_OPTIONS, getRangeOption } from "@/lib/rangeOptions";
import { ChartCard } from "./_components/ChartCard";

async function getSalesData(
    createdAfter: Date | null,
    createdBefore: Date | null
) {
    const createdAtQuery: Prisma.OrderWhereInput["createdAt"] = {};
    if (createdAfter) createdAtQuery.gte = createdAfter;
    if (createdBefore) createdAtQuery.lte = createdBefore;

    try {
        const [data, chartData] = await Promise.all([
            db.order.aggregate({
                _sum: { pricePaidInCents: true },
                _count: true,
                where: { createdAt: createdAtQuery },
            }),
            db.order.findMany({
                select: { createdAt: true, pricePaidInCents: true },
                where: { createdAt: createdAtQuery },
                orderBy: { createdAt: "asc" },
            }),
        ]);

        return {
            totalSales: data._sum.pricePaidInCents || 0,
            numberOfSales: data._count,
            amount: (data._sum.pricePaidInCents || 0) / 100, // Assuming amount should be in dollars
            chartData: chartData.map((order) => ({
                date: format(order.createdAt, "yyyy-MM-dd"),
                pricePaidInCents: order.pricePaidInCents,
            })),
        };
    } catch (error) {
        console.error("Error fetching sales data:", error);
        throw new Error("Failed to fetch sales data");
    }
}

async function getUserData(
    createdAfter: Date | null,
    createdBefore: Date | null
) {
    const createdAtQuery: Prisma.UserWhereInput["createdAt"] = {};
    if (createdAfter) createdAtQuery.gte = createdAfter;
    if (createdBefore) createdAtQuery.lte = createdBefore;

    const [userCount, orderData, chartData] = await Promise.all([
        db.user.count(),
        db.order.aggregate({
            _sum: { pricePaidInCents: true },
        }),
        db.user.findMany({
            select: { createdAt: true },
            where: { createdAt: createdAtQuery },
            orderBy: { createdAt: "asc" },
        }),
    ]);

    const { array, format } = getChartDateArray(
        createdAfter || startOfDay(chartData[0].createdAt),
        createdBefore || new Date()
    );

    const dayArray = array.map((date) => {
        return {
            date: format(date),
            totalUsers: 0,
        };
    });

    return {
        chartData: chartData.reduce((data, user) => {
            const formattedDate = format(user.createdAt);
            const entry = dayArray.find((day) => day.date === formattedDate);
            if (entry == null) return data;
            entry.totalUsers += 1;
            return data;
        }, dayArray),
        userCount,
        averageValuePerUser:
            userCount === 0
                ? 0
                : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
    };
}

async function getProductData(
    createdAfter: Date | null,
    createdBefore: Date | null
) {
    const createdAtQuery: Prisma.OrderWhereInput["createdAt"] = {};
    if (createdAfter) createdAtQuery.gte = createdAfter;
    if (createdBefore) createdAtQuery.lte = createdBefore;

    const [activeCount, inactiveCount, chartData] = await Promise.all([
        db.product.count({ where: { isAvailableForPurchase: true } }),
        db.product.count({ where: { isAvailableForPurchase: false } }),
        db.product.findMany({
            select: {
                name: true,
                orders: {
                    select: { pricePaidInCents: true },
                    where: { createdAt: createdAtQuery },
                },
            },
        }),
    ]);

    return {
        chartData: chartData
            .map((product) => {
                return {
                    name: product.name,
                    revenue: product.orders.reduce((sum, order) => {
                        return sum + order.pricePaidInCents / 100;
                    }, 0),
                };
            })
            .filter((product) => product.revenue > 0),
        activeCount,
        inactiveCount,
    };
}

export default async function AdminDashboard({
    searchParams: {
        totalSalesRange,
        totalSalesRangeFrom,
        totalSalesRangeTo,
        newCustomersRange,
        newCustomersRangeFrom,
        newCustomersRangeTo,
        revenueByProductRange,
        revenueByProductRangeFrom,
        revenueByProductRangeTo,
    },
}: {
    searchParams: {
        totalSalesRange?: string;
        totalSalesRangeFrom?: string;
        totalSalesRangeTo?: string;
        newCustomersRange?: string;
        newCustomersRangeFrom?: string;
        newCustomersRangeTo?: string;
        revenueByProductRange?: string;
        revenueByProductRangeFrom?: string;
        revenueByProductRangeTo?: string;
    };
}) {
    const totalSalesRangeOption =
        getRangeOption(
            totalSalesRange,
            totalSalesRangeFrom,
            totalSalesRangeTo
        ) || RANGE_OPTIONS.last_7_days;
    const newCustomersRangeOption =
        getRangeOption(
            newCustomersRange,
            newCustomersRangeFrom,
            newCustomersRangeTo
        ) || RANGE_OPTIONS.last_7_days;
    const revenueByProductRangeOption =
        getRangeOption(
            revenueByProductRange,
            revenueByProductRangeFrom,
            revenueByProductRangeTo
        ) || RANGE_OPTIONS.all_time;

    const [salesData, userData, productData] = await Promise.all([
        getSalesData(
            totalSalesRangeOption.startDate,
            totalSalesRangeOption.endDate
        ),
        getUserData(
            newCustomersRangeOption.startDate,
            newCustomersRangeOption.endDate
        ),
        getProductData(
            revenueByProductRangeOption.startDate,
            revenueByProductRangeOption.endDate
        ),
    ]);

    return (
        <>
            <PageHeader>Dashboard</PageHeader>
            <div className="mb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DashboardCard
                    title="Sales"
                    subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
                    body={formatCurrency(salesData.amount)}
                    className="bg-[#f44336]"
                />
                <DashboardCard
                    title="Customers"
                    subtitle={`${formatCurrency(
                        userData.averageValuePerUser
                    )} Average Value`}
                    className="bg-[#2196F3]"
                    body={formatNumber(userData.userCount)}
                />
                <DashboardCard
                    title="Active Products"
                    subtitle={`${formatNumber(
                        productData.inactiveCount
                    )} Inactive`}
                    className="bg-[#009688]"
                    body={formatNumber(productData.activeCount)}
                />
            </div>
            <ChartCard
                title="Total Sales"
                queryKey="totalSalesRange"
                selectedRangeLabel={totalSalesRangeOption.label}
            >
                <OrdersByDayChart data={salesData.chartData} />
            </ChartCard>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
                <ChartCard
                    title="New Customers"
                    queryKey="newCustomersRange"
                    selectedRangeLabel={newCustomersRangeOption.label}
                >
                    <UsersByDayChart data={userData.chartData} />
                </ChartCard>
                <ChartCard
                    title="Revenue By Product"
                    queryKey="revenueByProductRange"
                    selectedRangeLabel={revenueByProductRangeOption.label}
                >
                    <RevenueByProductChart data={productData.chartData} />
                </ChartCard>
            </div>
        </>
    );
}

type DashboardCardProps = {
    title: string;
    subtitle: string;
    body: string;
    className: string;
};

function DashboardCard({
    title,
    subtitle,
    body,
    className,
}: DashboardCardProps) {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="text-white">{title}</CardTitle>
                <CardDescription className="text-white">
                    {subtitle}
                </CardDescription>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-white">
                {body}
            </CardContent>
        </Card>
    );
}

function getChartDateArray(
    startDate: Date,
    endDate: Date
): { array: Date[]; format: (date: Date) => string } {
    const dayDiff = differenceInDays(endDate, startDate);
    if (dayDiff <= 90) {
        return {
            array: eachDayOfInterval({ start: startDate, end: endDate }),
            format: (date: Date) => format(date, "MMM d"),
        };
    }

    if (dayDiff <= 365) {
        return {
            array: eachWeekOfInterval(
                { start: startDate, end: endDate },
                { weekStartsOn: 1 }
            ).map((date) => endOfWeek(date, { weekStartsOn: 1 })),
            format: (date: Date) => format(date, "MMM d"),
        };
    }

    const monthDiff = differenceInMonths(endDate, startDate);
    if (monthDiff < 12 * 5) {
        return {
            array: eachMonthOfInterval({ start: startDate, end: endDate }),
            format: (date: Date) => format(date, "MMM yyyy"),
        };
    }

    return {
        array: eachYearOfInterval({ start: startDate, end: endDate }),
        format: (date: Date) => format(date, "yyyy"),
    };
}
