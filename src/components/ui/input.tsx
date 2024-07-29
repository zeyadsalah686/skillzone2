import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, accept = "", type, ...props }, ref) => {
		const [fileName, setFileName] = React.useState("");

		const handleFileChange = (
			event: React.ChangeEvent<HTMLInputElement>
		) => {
			const file = event.target.files?.[0];
			if (file) {
				setFileName(file.name);
			} else {
				setFileName("");
			}
		};

		return (
			<div className="relative flex items-center">
				{type === "file" ? (
					<div className="flex items-center w-full">
						<label className="flex items-center px-4 py-2 bg-[#171717] text-white rounded-l-md cursor-pointer hover:bg-main transition-colors">
							Choose File
							<input
								type="file"
								className="hidden"
								ref={ref}
								{...props}
								onChange={handleFileChange}
								accept={accept}
							/>
						</label>
						<input
							type="text"
							className={cn(
								"flex-1 h-10 w-full border border-input rounded-r-md bg-transparent px-5 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none",
								className
							)}
							readOnly
							value={fileName || "No File Chosen"}
							accept={accept}
						/>
					</div>
				) : (
					<input
						type={type}
						className={cn(
							"flex px-5 py-2 h-10 w-full rounded-md border border-input bg-transparent px-5 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none",
							className
						)}
						ref={ref}
						{...props}
					/>
				)}
			</div>
		);
	}
);

Input.displayName = "Input";

export { Input };
