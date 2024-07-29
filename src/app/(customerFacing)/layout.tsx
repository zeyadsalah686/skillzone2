"use client";

import { Nav, NavLink } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<div className="flex flex-col h-screen overflow-auto">
				<Nav>
					<NavLink href="/">Home</NavLink>
					<NavLink href="/products">Products</NavLink>
					<NavLink href="/orders">My Orders</NavLink>
				</Nav>
				<div>{children}</div>
			</div>
			<Footer />
		</>
	);
}
