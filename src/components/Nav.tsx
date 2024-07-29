import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode, useState } from "react";

export function Nav({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className="bg-white text-primary shadow-md">
			<div className="container px-4 py-3 flex justify-between items-center">
				<a href="/" className="text-2xl text-center">
					SkillZone
				</a>
				<button
					className="md:hidden"
					onClick={() => setIsOpen(!isOpen)}
				>
					☰
				</button>
				<div
					className={`hidden md:flex md:items-center ${
						isOpen ? "flex flex-col w-full mt-4" : "hidden"
					}`}
				>
					{children}
				</div>
			</div>
			{isOpen && (
				<div className="md:hidden flex flex-col items-start w-full px-4">
					{children}
				</div>
			)}
		</nav>
	);
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
	const pathname = usePathname();

	return (
		<Link
			{...props}
			className={cn(
				"p-2 md:p-4 mx-1 md:mx-2 mb-2 md:mb-0 hover:bg-main hover:rounded-md hover:text-white focus-visible:bg-main focus-visible:text-white",
				pathname === props.href && "bg-main text-white rounded-md"
			)}
		/>
	);
}
