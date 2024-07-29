import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { formatCurrency } from "@/lib/formatters";
import Link from "next/link";
import { notFound } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function SuccessPage({
    searchParams,
}: {
    searchParams: { payment_intent: string };
}) {
    const paymentIntent = await stripe.paymentIntents.retrieve(
        searchParams.payment_intent
    );
    if (paymentIntent.metadata.productId == null) return notFound();

    const product = await db.product.findUnique({
        where: { id: paymentIntent.metadata.productId },
    });
    if (product == null) return notFound();

    const isSuccess = paymentIntent.status === "succeeded";

    return (
        <div className="max-w-5xl w-full mx-auto space-y-8 mt-20 p-4">
            <h1 className="text-4xl text-center font-bold">
                {isSuccess ? "Success Payment! Check Your Email" : "Error!"}
            </h1>
            {isSuccess && (
                <div className="">
                    <h1 className="my-2">
                        Total Price: {formatCurrency(product.priceInCents)}
                    </h1>
                    <h1 className="my-2">Product Name: {product.name}</h1>
                    <h1 className="my-2">
                        Status: {isSuccess ? "Good" : "Bad"}
                    </h1>
                    <Button className="mt-4" size="lg" asChild>
                        {isSuccess ? (
                            <a
                                href={`/products/download/${await createDownloadVerification(
                                    product.id
                                )}`}
                            >
                                Download Course
                            </a>
                        ) : (
                            <Link href={`/products/${product.id}/purchase`}>
                                Try Again
                            </Link>
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
}

async function createDownloadVerification(productId: string) {
    const downloadVerification = await db.downloadVerification.create({
        data: {
            productId,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours expiry
        },
    });
    return downloadVerification.id;
}
