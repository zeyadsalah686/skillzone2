import db from "@/db/db";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CheckCircle2, XCircle, MoreVertical } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeader } from "../_components/PageHeader";
import { DeleteDropDownItem } from "./_components/UserActions"

export default function AdminUsersPage() {
    return (
        <>
            <div className="flex justify-between items-center gap-4 mb-6">
                <PageHeader>Customers</PageHeader>
            </div>
            <UserTable />
        </>
    );
}

async function UserTable() {
    const users = await db.user.findMany({
        select: {
            id: true,
            email: true,
            orders: { select: { pricePaidInCents: true } },
        },
        orderBy: { createdAt: "asc" },
    });

    if (users.length === 0) return <h3>No Customers found</h3>;

    return (
        <div className="overflow-x-auto">
            <Table className="min-w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead className="w-0">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                                {formatNumber(user.orders.length)}
                            </TableCell>
                            <TableCell>
                                {formatCurrency(
                                    user.orders.reduce(
                                        (sum, o) => o.pricePaidInCents + sum,
                                        0
                                    ) / 100
                                )}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <MoreVertical />
                                        <span className="sr-only">Actions</span>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DeleteDropDownItem id={user.id} />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
