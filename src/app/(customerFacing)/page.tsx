import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { PrismaClient } from "@prisma/client"; // Import PrismaClient instead
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

const prisma = new PrismaClient();

const getMostPopularProducts = cache(() => {
	return prisma.product.findMany({
		where: { isAvailableForPurchase: true },
		orderBy: { orders: { _count: "desc" } },
		take: 6,
	});
}, ["/", "getMostPopularProducts"], { revalidate: 60 * 60 * 24 });

const getNewestProducts = cache(() => {
	return prisma.product.findMany({
		where: { isAvailableForPurchase: true },
		orderBy: { createdAt: "desc" },
		take: 6,
	});
}, ["/", "getNewestProducts"]);

export default function HomePage() {
	return (
		<>
			<HeroSection />
			<main className="space-y-12 my-12 container">
				<ProductGridSection
					title="Most Popular"
					productsFetcher={getMostPopularProducts}
					sort="popular"
				/>
				<br />
				<br />
				<ProductGridSection
					title="Newest"
					sort="newest"
					productsFetcher={getNewestProducts}
				/>
			</main>
		</>
	);
}

type ProductGridSectionProps = {
	title: string;
	productsFetcher: () => Promise<any[]>; // Use `any[]` or define a proper type for products
	sort: string;
};

function ProductGridSection({
	productsFetcher,
	title,
	sort
}: ProductGridSectionProps) {
	return (
		<div className="space-y-4">
			<div className="flex gap-4">
				<h2 className="text-2xl font-bold">{title}</h2>
				<Button variant="outline" asChild>
					<Link
						href={`/products?sort=${sort}`}
						className="space-x-2 hover:text-white"
					>
						<span>View All</span>
						<ArrowRight className="size-4" />
					</Link>
				</Button>
			</div>
			<br />
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Suspense
					fallback={
						<>
							<ProductCardSkeleton />
							<ProductCardSkeleton />
							<ProductCardSkeleton />
						</>
					}
				>
					<ProductSuspense productsFetcher={productsFetcher} />
				</Suspense>
			</div>
		</div>
	);
}

async function ProductSuspense({
	productsFetcher,
}: {
	productsFetcher: () => Promise<any[]>; // Use `any[]` or define a proper type for products
}) {
	return (await productsFetcher()).map((product) => (
		<ProductCard key={product.id} {...product} />
	));
}

function HeroSection() {
	return (
		<>
			<section className="bg-gray-100">
				<div className="mx-auto px-4 py-28 lg:flex lg:items-center">
					<div className="mx-auto max-w-xl text-center">
						<h1 className="text-3xl font-extrabold sm:text-5xl">
							Welcome To SkillZone.
							<strong className="mt-4 font-bold text-main sm:block">
								{" "}
								All Courses Are Here.{" "}
							</strong>
						</h1>

						<p className="my-4 sm:text-xl/relaxed">
							Lorem ipsum dolor sit amet consectetur, adipisicing
							elit. Nesciunt illo tenetur fuga ducimus numquam ea!
						</p>

						<Button>
							<Link href="/products/">Shop now</Link>
						</Button>
					</div>
				</div>
			</section>
		</>
	);
}