import { ProductCard } from "@/components/ProductCard";
import db from "@/db/db";
import ProductSearch from "@/components/ProductSearch";

type SortOption = "newest" | "popular" | "oldest";

interface ProductsPageProps {
    searchParams: {
        sort?: SortOption;
        search?: string;
    };
}

export type Product = {
    id: string;
    name: string;
    priceInCents: number;
    description: string;
    imagePath: string;
    isAvailableForPurchase: boolean;
    createdAt: Date;
};

const ProductsPage = async ({ searchParams }: ProductsPageProps) => {
    const sort = searchParams.sort || "newest";
    const search = searchParams.search || "";

    const orderBy:
        | { createdAt?: "asc" | "desc" }
        | { orders?: { _count: "asc" | "desc" } }
        | { name?: "asc" | "desc" } =
        sort === "newest"
            ? { createdAt: "desc" }
            : sort === "popular"
            ? { orders: { _count: "desc" } }
            : sort === "oldest"
            ? { createdAt: "asc" }
            : { name: "asc" };

    let products: Product[] = [];

    try {
        products = await db.product.findMany({
            where: {
                isAvailableForPurchase: true,
                name: {
                    contains: search,
                },
            },
            orderBy: orderBy,
            include: {
                orders: true,
            },
        });
    } catch (error) {
        console.error("Database query error:", error);
        // Optionally return a custom error message or component
        return (
            <div className="container">
                <h2 className="mt-14 mb-3 text-3xl font-bold">Products</h2>
                <p className="my-12 font-semibold text-2xl">Error fetching products.</p>
            </div>
        );
    }

    return (
        <div className="container">
            <h2 className="mt-14 mb-3 text-3xl font-bold">Products</h2>
            <p className="font-medium mb-14">Sort Type: {sort}</p>
            <ProductSearch sort={sort} search={search} />
            <div className="my-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.length === 0 ? (
                    <p className="my-12 font-semibold text-2xl">
                        There are no products right now or there is a problem.
                    </p>
                ) : (
                    products.map((product: Product) => (
                        <ProductCard key={product.id} {...product} />
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
