"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { emailOrderHistory } from "@/actions/orders";

export default function MyOrdersPage() {
    const [data, action] = useFormState(emailOrderHistory, {});

    return (
        <>
            <div className="container my-12">
                <form action={action} className="max-2-xl mx-auto">
                    <Card className="p-2">
                        <CardHeader>
                            <CardTitle className="mb-3 text-primary">
                                My Orders
                            </CardTitle>
                            <CardDescription className="mb-2 text-primary">
                                Enter your email and we will email you with your
                                order history and download links
                            </CardDescription>
                            <CardContent className="p-0">
                                <div className="my-5">
                                    <Label
                                        htmlFor="email"
                                        className="text-primary text-lg"
                                    >
                                        Email
                                    </Label>
                                    <Input
                                        placeholder="Enter your email"
                                        type="email"
                                        required
                                        name="email"
                                        id="email"
                                        className="mt-2 text-primary"
                                    />
                                    {data.error && (
                                        <div className="text-destructive">
                                            {data.error}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="p-0">
                                {data.message ? (
                                    <p className="text-primary">{data.message}</p>
                                ) : (
                                    <SubmitButton />
                                )}
                            </CardFooter>
                        </CardHeader>
                    </Card>
                </form>
            </div>
        </>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button className="w-full" size="lg" type="submit" disabled={pending}>
            {pending ? "Sending..." : "Send"}
        </Button>
    );
}
