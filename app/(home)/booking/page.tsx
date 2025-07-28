import Loading from "@/app/loading2";
import BookingForm from "@/components/booking/booking-form";
import { Suspense } from "react";

export default function BookingPage() {
	return (
		<Suspense fallback={<Loading />}>
			<BookingForm />
		</Suspense>
	);
}
