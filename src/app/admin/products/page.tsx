import Link from "next/link";
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
import {
    ActiveToggleDropdownItem,
    DeleteDropdownItem,
} from "./_components/ProductActions";
import { PageHeader } from "../_components/PageHeader";
import { Button } from "@/components/ui/button";
import Image from "next/image";

function getProducts() {
    return db.product.findMany({
        select: {
            id: true,
            name: true,
            priceInCents: true,
            isAvailableForPurchase: true,
            imagePath: true,
            _count: { select: { orders: true } },
        },
        orderBy: { name: "asc" },
    });
}

export default function AdminProductsPage() {
    return (
        <>
            <div className="flex justify-between items-center gap-4 mb-6">
                <PageHeader>Products</PageHeader>
                <Button>
                    <Link href="/admin/products/new">Add Product</Link>
                </Button>
            </div>
            <ProductsTable />
        </>
    );
}

async function ProductsTable() {
    const products = await getProducts();

    if (products.length === 0) return <h3>No products found</h3>;

    return (
        <div className="overflow-x-auto">
            <Table className="min-w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-0">Active</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Img</TableHead>
                        <TableHead className="w-0">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>
                                {product.isAvailableForPurchase ? (
                                    <>
                                        <CheckCircle2 className="text-teal-600" />
                                        <span className="sr-only">
                                            Available
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="stroke-destructive" />
                                        <span className="sr-only">
                                            Unavailable
                                        </span>
                                    </>
                                )}
                            </TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>
                                {formatCurrency(product.priceInCents / 100)}
                            </TableCell>
                            <TableCell>
                                {formatNumber(product._count.orders)}
                            </TableCell>
                            <TableCell>
                                <Image
                                    src={product.imagePath}
                                    alt="Product Image"
                                    width={40}
                                    height={40}
                                    objectFit="cover"
                                />
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <MoreVertical />
                                        <span className="sr-only">Actions</span>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem asChild>
                                            <a
                                                href={`/admin/products/${product.id}/download`}
                                                download
                                            >
                                                Download
                                            </a>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                            >
                                                Edit
                                            </Link>
                                        </DropdownMenuItem>
                                        <ActiveToggleDropdownItem
                                            id={product.id}
                                            isAvailableForPurchase={
                                                product.isAvailableForPurchase
                                            }
                                        />
                                        <DropdownMenuSeparator />
                                        <DeleteDropdownItem
                                            id={product.id}
                                            disabled={product._count.orders > 0}
                                        />
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
