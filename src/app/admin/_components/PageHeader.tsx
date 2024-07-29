import { ReactNode } from "react";

export function PageHeader({ children }: { children: ReactNode }) {
	return <h1 className="text-4xl mt-12 mb-8">{children}</h1>;
}
