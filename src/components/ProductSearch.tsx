"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type SortOption = "newest" | "popular" | "oldest";

interface ProductSearchProps {
	sort: SortOption;
	search: string;
}

const ProductSearch = ({ sort, search }: ProductSearchProps) => {
	const [searchTerm, setSearchTerm] = useState(search);

	const handleSearch = () => {
		window.location.href = `/products?sort=${sort}&search=${searchTerm}`;
	};

	const getSortUrl = (sortOption: SortOption) => {
		const baseUrl = `/products?sort=${sortOption}`;
		return searchTerm ? `${baseUrl}&search=${searchTerm}` : baseUrl;
	};

	return (
		<div className="flex flex-wrap gap-3 sm:justify-between mb-8 items-center">
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
				<Button
					variant="outline"
					asChild
					className={`space-x-1 hover:bg-main hover:border-main hover:text-white ${
						sort === "newest" ? "text-blue-500 border-blue-500" : ""
					}`}
				>
					<Link href={getSortUrl("newest")}>
						<span>Newest</span>
						<ArrowRight className="size-4" />
					</Link>
				</Button>
				<Button
					variant="outline"
					asChild
					className={`space-x-1 hover:bg-main hover:border-main hover:text-white ${
						sort === "popular"
							? "text-blue-500 border-blue-500"
							: ""
					}`}
				>
					<Link href={getSortUrl("popular")}>
						<span>Popular</span>
						<ArrowRight className="size-4" />
					</Link>
				</Button>
				<Button
					variant="outline"
					asChild
					className={`space-x-1 hover:bg-main hover:border-main hover:text-white ${
						sort === "oldest" ? "text-blue-500 border-blue-500" : ""
					}`}
				>
					<Link href={getSortUrl("oldest")}>
						<span>Oldest</span>
						<ArrowRight className="size-4" />
					</Link>
				</Button>
			</div>
			<div className="flex items-center space-x-4">
				<Input
					type="text"
					placeholder="Search Products"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-40"
				/>
				<Button
					variant="outline"
					onClick={handleSearch}
					className="space-x-2 hover:bg-main hover:border-main hover:text-white"
				>
					<span>Search</span>
					<ArrowRight className="size-4" />
				</Button>
			</div>
		</div>
	);
};

export default ProductSearch;
