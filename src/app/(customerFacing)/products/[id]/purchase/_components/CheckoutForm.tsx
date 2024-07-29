"use client";

import { Button } from "@/components/ui/button";
import { userOrderExists } from "@/app/actions/orders";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import {
	Elements,
	LinkAuthenticationElement,
	PaymentElement,
	useElements,
	useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { FormEvent, useState } from "react";

type CheckoutFormProps = {
	product: {
		id: string;
		imagePath: string;
		name: string;
		priceInCents: number;
		description: string;
	};
	clientSecret: string;
};

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export function CheckoutForm({ product, clientSecret }: CheckoutFormProps) {
	const [sliceVal, setSliceVal] = useState(200);

	return (
		<>
			<div className="max-w-5xl mt-8 w-full mx-auto space-y-8">
				<div className="flex gap-4 mb-12 flex-col sm:flex-row">
					<div className="border w-80 mb-5 sm:mb-0 sm:mr-9 aspect-video flex-shrink-0 sm:w-1/3 relative">
						<Image
							src={product.imagePath}
							fill
							alt={product.name}
							className="object-cover"
						/>
					</div>
					<div className="mt-2">
						<div className="text-lg">
							{formatCurrency(product.priceInCents / 100)}
						</div>
						<h1 className="my-2 text-2xl font-bold">
							{product.name}
						</h1>
						<div className="text-muted-foreground">
							{product.description.slice(0, sliceVal)}
							<span
								className="cursor-pointer duration-700"
								onClick={() => {
									setSliceVal(
										sliceVal == 200
											? product.description.length - 1
											: 60
									);
								}}
							>
								...
							</span>
						</div>
					</div>
				</div>
				<Elements options={{ clientSecret }} stripe={stripePromise}>
					<Form
						priceInCents={product.priceInCents}
						productId={product.id}
					/>
				</Elements>
			</div>
		</>
	);
}

function Form({
	priceInCents,
	productId,
}: {
	priceInCents: number;
	productId: string;
}) {
	const stripe = useStripe();
	const elements = useElements();
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string>();
	const [email, setEmail] = useState<string>();

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();

		if (stripe == null || elements == null || email == null) return;

		setIsLoading(true);

		const orderExists = await userOrderExists(email, productId);

		if (orderExists) {
			setErrorMessage(
				"You have already purchased this product. Try downloading it from the My Orders page"
			);

			setIsLoading(false);
			return;
		}

		stripe
			.confirmPayment({
				elements,
				confirmParams: {
					return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
				},
			})
			.then(({ error }) => {
				if (
					error.type === "card_error" ||
					error.type === "validation_error"
				) {
					setErrorMessage(error.message);
				} else {
					setErrorMessage("An unknown error occurred");
				}
			})
			.finally(() => setIsLoading(false));
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				<Card className="sm:p-2 p-0">
					<CardHeader>
						<CardTitle className="text-primary mb-4">
							Checkout
						</CardTitle>
						{errorMessage && (
							<CardDescription className="text-destructive">
								{errorMessage}
							</CardDescription>
						)}
					</CardHeader>
					<CardContent>
						<PaymentElement />
						<div className="mt-5">
							<LinkAuthenticationElement
								onChange={(e) => setEmail(e.value.email)}
							/>
						</div>
					</CardContent>
					<CardFooter>
						<Button
							className="w-full"
							size="lg"
							type="submit"
							disabled={
								stripe == null || elements == null || isLoading
							}
						>
							{isLoading
								? "Purchasing..."
								: `Purchase - ${formatCurrency(
										priceInCents / 100
								  )}`}
						</Button>
					</CardFooter>
				</Card>
			</form>
		</>
	);
}
