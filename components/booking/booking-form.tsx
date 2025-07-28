"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Calendar,
	CreditCard,
	Check,
	ArrowLeft,
	ArrowRight,
	Star,
	Phone,
	Mail,
	User,
	Globe,
} from "lucide-react";
import Image from "next/image";
import {
	addOns,
	countries,
	destinations,
	packages,
	steps,
} from "@/lib/mocData";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BookingData, TripType } from "@/lib/type";

export default function BookingForm() {
	const searchParams = useSearchParams();

	const tripType = searchParams.get("type") as TripType;
	const tripId = searchParams.get("id");

	const selectedTrip =
		tripType === "destination"
			? destinations.find((trip) => trip.id === tripId)
			: packages.find((trip) => trip.id === tripId);

	const initialBookingData: BookingData = {
		tripType: tripType || "",
		selectedTrip: selectedTrip || null,
		travelDates: { departure: "", return: "" },
		travelers: { adults: 2, children: 0, infants: 0 },
		travelers_info: [],
		emergencyContact: { name: "", relationship: "", phone: "", email: "" },
		roomPreference: "",
		dietaryRequirements: [],
		specialRequests: "",
		addOns: [],
		interests: [],
		paymentMethod: "",
		billingAddress: {
			firstName: "",
			lastName: "",
			address: "",
			city: "",
			state: "",
			zipCode: "",
			country: "",
		},
		cardDetails: { number: "", expiry: "", cvv: "", name: "" },
	};

	const [currentStep, setCurrentStep] = useState(1);

	const [bookingData, setBookingData] =
		useState<BookingData>(initialBookingData);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const totalSteps = 5;

	const updateBookingData = (updates: Partial<BookingData>) => {
		setBookingData((prev) => ({ ...prev, ...updates }));
	};

	const nextStep = () => {
		if (currentStep < totalSteps) {
			setCurrentStep(currentStep + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 1) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);

		await new Promise((resolve) => setTimeout(resolve, 2000));

		console.log("=== BOOKING SUBMISSION ===");
		console.log(
			"Complete Booking Data:",
			JSON.stringify(bookingData, null, 2)
		);
		console.log("=== END BOOKING DATA ===");

		setIsSubmitting(false);
		setCurrentStep(5);
	};

	const calculateTotal = () => {
		let total = bookingData.selectedTrip?.price || 0;
		total *= bookingData.travelers.adults + bookingData.travelers.children;

		bookingData.addOns.forEach((addonId) => {
			const addon = addOns.find((a) => a.id === addonId);
			if (addon) total += addon.price;
		});

		return total;
	};

	const renderContent = () => {
		switch (currentStep) {
			case 1:
				return (
					<div className="space-y-8">
						<div>
							<Label className="text-xl font-surfer font-semibold mb-4 block">
								Choose Trip Type
							</Label>
							<RadioGroup
								value={bookingData.tripType}
								onValueChange={(value) =>
									updateBookingData({
										tripType: value as TripType,
									})
								}
								className="grid grid-cols-1 border-none md:grid-cols-2 gap-4"
							>
								<div className="flex items-center space-x-2 p-4 border rounded-tr-4xl hover:bg-[#CDC8BC] duration-300">
									<RadioGroupItem
										value="destination"
										id="destination"
									/>
									<Label
										htmlFor="destination"
										className="flex-1 cursor-pointer"
									>
										<div className="flex items-start">
											<div>
												<div className="text-sm">
													Individual Destinations
												</div>
												<div className="text-base text-gray-600">
													Choose specific destinations
												</div>
											</div>
										</div>
									</Label>
								</div>

								<div className="flex items-center space-x-2 p-4 border rounded-tr-4xl hover:bg-[#CDC8BC]">
									<RadioGroupItem
										value="package"
										id="package"
									/>
									<Label
										htmlFor="package"
										className="flex-1 cursor-pointer"
									>
										<div className="flex items-center">
											<div>
												<div className="font-sm">
													Complete Packages
												</div>
												<div className="text-base text-gray-600">
													All-inclusive travel
													packages
												</div>
											</div>
										</div>
									</Label>
								</div>
							</RadioGroup>
						</div>

						{bookingData.tripType && (
							<div>
								<Label className="text-xl font-surfer font-semibold mb-4 block">
									Select Your
									{bookingData.tripType === "destination"
										? " Destination"
										: " Package"}
								</Label>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{(bookingData.tripType === "destination"
										? destinations
										: packages
									).map((item) => (
										<Card
											key={item.id}
											className={`cursor-pointer bg-transparent transition-all duration-300 hover:shadow-lg rounded-t-4xl ${
												bookingData.selectedTrip?.id ===
												item.id
													? "ring-2 ring-secondary rounded-t-4xl bg-[#CDC8BC]"
													: ""
											}`}
											onClick={() =>
												updateBookingData({
													selectedTrip: item,
												})
											}
										>
											<div className="relative h-40">
												<Image
													src={item.image}
													alt={item.title}
													fill
													className="object-cover rounded-t-4xl"
												/>
												{bookingData.selectedTrip
													?.id === item.id && (
													<div className="absolute top-2 right-2 bg-secondary text-white rounded-full p-1">
														<Check className="h-4 w-4" />
													</div>
												)}
											</div>
											<CardContent className="p-4">
												<h3 className="font-semibold text-lg mb-2 font-surfer">
													{item.title}
												</h3>
												{"duration" in item && (
													<p className="text-sm font-bruno text-gray-600 mb-2">
														{item.duration}
													</p>
												)}
												{"rating" in item && (
													<div className="flex items-center gap-1 mb-2">
														<span className="text-sm">
															{item.rating}
														</span>
														<Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
													</div>
												)}
												<div className="flex items-center justify-between">
													{"originalPrice" in
														item && (
														<span className="text-sm text-gray-500 line-through">
															$
															{item.originalPrice}
														</span>
													)}
													<span className="text-xl font-bold text-secondary">
														${item.price}
													</span>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							</div>
						)}

						{bookingData.selectedTrip && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<Label
										htmlFor="departure"
										className="text-xl font-surfer"
									>
										Departure Date
									</Label>
									<Input
										id="departure"
										type="date"
										value={
											bookingData.travelDates.departure
										}
										onChange={(e) =>
											updateBookingData({
												travelDates: {
													...bookingData.travelDates,
													departure: e.target.value,
												},
											})
										}
										className="mt-2"
									/>
								</div>
								<div>
									<Label
										htmlFor="return"
										className="text-xl font-surfer"
									>
										Return Date
									</Label>
									<Input
										id="return"
										type="date"
										value={bookingData.travelDates.return}
										onChange={(e) =>
											updateBookingData({
												travelDates: {
													...bookingData.travelDates,
													return: e.target.value,
												},
											})
										}
										className="mt-2"
									/>
								</div>
							</div>
						)}

						{bookingData.selectedTrip && (
							<div>
								<Label className="text-xl font-surfer font-semibold mb-4 block">
									Number of Travelers
								</Label>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
									<div>
										<Label
											htmlFor="adults"
											className="text-sm"
										>
											Adults (18+)
										</Label>
										<Select
											value={bookingData.travelers.adults.toString()}
											onValueChange={(value) =>
												updateBookingData({
													travelers: {
														...bookingData.travelers,
														adults: Number.parseInt(
															value
														),
													},
												})
											}
										>
											<SelectTrigger className="mt-2 w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{[1, 2, 3, 4, 5, 6, 7, 8].map(
													(num) => (
														<SelectItem
															key={num}
															value={num.toString()}
														>
															{num}
														</SelectItem>
													)
												)}
											</SelectContent>
										</Select>
									</div>

									<div>
										<Label
											htmlFor="children"
											className="text-sm"
										>
											Children (2-17)
										</Label>
										<Select
											value={bookingData.travelers.children.toString()}
											onValueChange={(value) =>
												updateBookingData({
													travelers: {
														...bookingData.travelers,
														children:
															Number.parseInt(
																value
															),
													},
												})
											}
										>
											<SelectTrigger className="mt-2 w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{[0, 1, 2, 3, 4, 5, 6].map(
													(num) => (
														<SelectItem
															key={num}
															value={num.toString()}
														>
															{num || "None"}
														</SelectItem>
													)
												)}
											</SelectContent>
										</Select>
									</div>

									<div>
										<Label
											htmlFor="infants"
											className="text-sm"
										>
											Infants (0-2)
										</Label>
										<Select
											value={bookingData.travelers.infants.toString()}
											onValueChange={(value) =>
												updateBookingData({
													travelers: {
														...bookingData.travelers,
														infants:
															Number.parseInt(
																value
															),
													},
												})
											}
										>
											<SelectTrigger className="mt-2 w-full">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{[0, 1, 2, 3, 4].map((num) => (
													<SelectItem
														key={num}
														value={num.toString()}
													>
														{num || "None"}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>
						)}
					</div>
				);

			case 2:
				return (
					<div className="space-y-8">
						{Array.from(
							{
								length:
									bookingData.travelers.adults +
									bookingData.travelers.children,
							},
							(_, index) => {
								const isChild =
									index >= bookingData.travelers.adults;
								const travelerType = isChild
									? "child"
									: "adult";
								const travelerNumber = isChild
									? index - bookingData.travelers.adults + 1
									: index + 1;

								return (
									<Card
										key={index}
										className="p-6 bg-transparent border-border-primary/30"
									>
										<h3 className="text-xl font-surfer font-semibold mb-4 flex items-center">
											<User className="h-5 w-5 mr-2 text-secondary" />
											{travelerType === "adult"
												? "Adult"
												: "Child"}
											{travelerNumber}
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<Label
													htmlFor={`firstName-${index}`}
												>
													First Name
												</Label>
												<Input
													id={`firstName-${index}`}
													placeholder="Agnes"
													className="mt-2"
													required
												/>
											</div>
											<div>
												<Label
													htmlFor={`lastName-${index}`}
												>
													Last Name
												</Label>
												<Input
													id={`lastName-${index}`}
													placeholder="Owens"
													className="mt-2"
												/>
											</div>
											<div>
												<Label htmlFor={`dob-${index}`}>
													Date of Birth
												</Label>
												<Input
													id={`dob-${index}`}
													type="date"
													className="mt-2"
												/>
											</div>
											<div>
												<Label
													htmlFor={`passport-${index}`}
												>
													Passport Number
												</Label>
												<Input
													id={`passport-${index}`}
													placeholder="A1234567"
													className="mt-2"
												/>
											</div>
											<div className="md:col-span-2">
												<Label
													htmlFor={`nationality-${index}`}
												>
													Nationality
												</Label>
												<Select>
													<SelectTrigger className="mt-2">
														<SelectValue placeholder="Select nationality" />
													</SelectTrigger>
													<SelectContent>
														{countries.map(
															(country) => (
																<SelectItem
																	key={
																		country.code
																	}
																	value={
																		country.code
																	}
																>
																	{
																		country.name
																	}
																</SelectItem>
															)
														)}
													</SelectContent>
												</Select>
											</div>
										</div>
									</Card>
								);
							}
						)}

						<Card className="p-6 bg-transparent border-border-primary/30">
							<h3 className="text-xl font-surfer font-semibold mb-4 flex items-center">
								<Phone className="h-5 w-5 mr-2 text-secondary" />
								Emergency Contact
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor="emergency-name">
										Hallie Rogers
									</Label>
									<Input
										id="emergency-name"
										placeholder="Enter emergency contact name"
										className="mt-2"
									/>
								</div>
								<div>
									<Label htmlFor="emergency-relationship">
										Relationship
									</Label>
									<Input
										id="emergency-relationship"
										placeholder="e.g. Spouse, Parent, Friend"
										className="mt-2"
									/>
								</div>
								<div>
									<Label htmlFor="emergency-phone">
										Phone Number
									</Label>
									<Input
										id="emergency-phone"
										placeholder="(662) 897-8636"
										className="mt-2"
									/>
								</div>
								<div>
									<Label htmlFor="emergency-email">
										Email Address
									</Label>
									<Input
										id="emergency-email"
										type="email"
										placeholder="peticum@goave.cv"
										className="mt-2"
									/>
								</div>
							</div>
						</Card>
					</div>
				);

			case 3:
				return (
					<div className="space-y-8">
						<div>
							<Label className="text-xl font-surfer font-semibold mb-4 block">
								Room Preferences
							</Label>
							<RadioGroup
								value={bookingData.roomPreference}
								onValueChange={(value) =>
									updateBookingData({
										roomPreference: value,
									})
								}
								className="flex flex-wrap justify-start gap-4 md:gap-8 xl:gap-12"
							>
								<div className="flex items-center space-x-2">
									<RadioGroupItem
										value="single"
										id="single"
									/>
									<Label htmlFor="single">Single Room</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem
										value="double"
										id="double"
									/>
									<Label htmlFor="double">Double Room</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="twin" id="twin" />
									<Label htmlFor="twin">Twin Beds</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="suite" id="suite" />
									<Label htmlFor="suite">Suite</Label>
								</div>
							</RadioGroup>
						</div>

						<div>
							<Label className="text-xl font-surfer font-semibold mb-4 block">
								Dietary Requirements
							</Label>
							<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
								{[
									"Vegetarian",
									"Vegan",
									"Gluten-Free",
									"Halal",
									"Kosher",
									"No Restrictions",
								].map((diet) => (
									<div
										key={diet}
										className="flex items-center space-x-2"
									>
										<Checkbox
											id={diet}
											checked={bookingData.dietaryRequirements.includes(
												diet
											)}
											onCheckedChange={(checked) => {
												if (checked) {
													updateBookingData({
														dietaryRequirements: [
															...bookingData.dietaryRequirements,
															diet,
														],
													});
												} else {
													updateBookingData({
														dietaryRequirements:
															bookingData.dietaryRequirements.filter(
																(d) =>
																	d !== diet
															),
													});
												}
											}}
										/>
										<Label
											htmlFor={diet}
											className="text-sm"
										>
											{diet}
										</Label>
									</div>
								))}
							</div>
						</div>

						<div>
							<Label className="text-xl font-surfer font-semibold mb-4 block">
								Travel Interests
							</Label>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								{[
									"Adventure",
									"Culture",
									"Food",
									"Photography",
									"Wildlife",
									"Relaxation",
									"History",
									"Nature",
								].map((interest) => (
									<div
										key={interest}
										className="flex items-center space-x-2"
									>
										<Checkbox
											id={interest}
											checked={bookingData.interests.includes(
												interest
											)}
											onCheckedChange={(checked) => {
												if (checked) {
													updateBookingData({
														interests: [
															...bookingData.interests,
															interest,
														],
													});
												} else {
													updateBookingData({
														interests:
															bookingData.interests.filter(
																(i) =>
																	i !==
																	interest
															),
													});
												}
											}}
										/>
										<Label
											htmlFor={interest}
											className="text-sm"
										>
											{interest}
										</Label>
									</div>
								))}
							</div>
						</div>

						<div>
							<Label className="text-xl font-surfer font-semibold mb-4 block">
								Optional Add-ons
							</Label>
							<div className="space-y-4">
								{addOns.map((addon) => (
									<Card key={addon.id} className="p-4">
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-3">
												<Checkbox
													id={addon.id}
													checked={bookingData.addOns.includes(
														addon.id
													)}
													onCheckedChange={(
														checked
													) => {
														if (checked) {
															updateBookingData({
																addOns: [
																	...bookingData.addOns,
																	addon.id,
																],
															});
														} else {
															updateBookingData({
																addOns: bookingData.addOns.filter(
																	(a) =>
																		a !==
																		addon.id
																),
															});
														}
													}}
												/>
												<div>
													<Label
														htmlFor={addon.id}
														className="font-medium cursor-pointer"
													>
														{addon.name}
													</Label>
													<p className="text-sm text-gray-600">
														{addon.description}
													</p>
												</div>
											</div>
											<div className="text-right">
												<span className="font-bold text-secondary">
													${addon.price}
												</span>
											</div>
										</div>
									</Card>
								))}
							</div>
						</div>

						<div>
							<Label
								htmlFor="special-requests"
								className="text-xl font-surfer font-semibold mb-4 block"
							>
								Special Requests
							</Label>
							<Textarea
								id="special-requests"
								placeholder="Any special requests or requirements for your trip..."
								value={bookingData.specialRequests}
								onChange={(e) =>
									updateBookingData({
										specialRequests: e.target.value,
									})
								}
								rows={4}
							/>
						</div>
					</div>
				);

			case 4:
				return (
					<div className="space-y-8">
						<Card className="p-6 bg-[#CDC8BC]">
							<h3 className="text-xl font-surfer font-semibold mb-4">
								Booking Summary
							</h3>
							<div className="space-y-2">
								<div className="flex justify-between">
									<span className="font-semibold">
										{bookingData.selectedTrip?.title}
									</span>
									<span>
										${bookingData.selectedTrip?.price}
									</span>
								</div>
								<div className="flex justify-between">
									<span>
										Travelers:{" "}
										{bookingData.travelers.adults +
											bookingData.travelers.children}
									</span>
									<span>
										$
										{(bookingData.selectedTrip?.price ||
											0) *
											(bookingData.travelers.adults +
												bookingData.travelers.children)}
									</span>
								</div>
								{bookingData.addOns.map((addonId) => {
									const addon = addOns.find(
										(a) => a.id === addonId
									);
									return addon ? (
										<div
											key={addon.id}
											className="flex justify-between"
										>
											<span>{addon.name}</span>
											<span>+ ${addon.price}</span>
										</div>
									) : null;
								})}
								<div className="border-t border-border-primary pt-2 flex justify-between font-bold text-lg">
									<span className="font-bruno">Total</span>
									<span className="text-secondary">
										${calculateTotal()}
									</span>
								</div>
							</div>
						</Card>

						<div>
							<Label className="text-xl font-surfer font-semibold mb-4 block">
								Payment Method
							</Label>
							<RadioGroup
								value={bookingData.paymentMethod}
								onValueChange={(value) =>
									updateBookingData({
										paymentMethod: value,
									})
								}
								className="space-y-3"
							>
								<div className="flex items-center space-x-2 p-4 border rounded-lg">
									<RadioGroupItem value="card" id="card" />
									<Label
										htmlFor="card"
										className="flex items-center cursor-pointer"
									>
										<CreditCard className="h-5 w-5 mr-2 text-secondary" />
										Credit/Debit Card
									</Label>
								</div>
								<div className="flex items-center space-x-2 p-4 border rounded-lg">
									<RadioGroupItem
										value="paypal"
										id="paypal"
									/>
									<Label
										htmlFor="paypal"
										className="flex items-center cursor-pointer"
									>
										<Globe className="h-5 w-5 mr-2 text-secondary" />
										PayPal
									</Label>
								</div>
							</RadioGroup>
						</div>

						{bookingData.paymentMethod === "card" && (
							<Card className="p-6 bg-transparent border-border-primary/30">
								<h3 className="text-xl font-surfer font-semibold mb-4">
									Card Details
								</h3>
								<div className="space-y-4">
									<div>
										<Label htmlFor="card-name">
											Cardholder Name
										</Label>
										<Input
											id="card-name"
											placeholder="Russell Glover"
											className="mt-2"
										/>
									</div>
									<div>
										<Label htmlFor="card-number">
											Card Number
										</Label>
										<Input
											id="card-number"
											placeholder="1234 5678 9012 3456"
											className="mt-2"
										/>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label htmlFor="card-expiry">
												Expiry Date
											</Label>
											<Input
												id="card-expiry"
												placeholder="MM/YY"
												className="mt-2"
											/>
										</div>
										<div>
											<Label htmlFor="card-cvv">
												CVV
											</Label>
											<Input
												id="card-cvv"
												placeholder="123"
												className="mt-2"
											/>
										</div>
									</div>
								</div>
							</Card>
						)}

						<Card className="p-6 bg-transparent border-border-primary/30">
							<h3 className="text-xl font-surfer font-semibold mb-4">
								Billing Address
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<Label htmlFor="billing-first-name">
										First Name
									</Label>
									<Input
										id="billing-first-name"
										placeholder="Joel"
										className="mt-2"
									/>
								</div>
								<div>
									<Label htmlFor="billing-last-name">
										Last Name
									</Label>
									<Input
										id="billing-last-name"
										placeholder="Esquivel"
										className="mt-2"
									/>
								</div>
								<div className="md:col-span-2">
									<Label htmlFor="billing-address">
										Address
									</Label>
									<Input
										id="billing-address"
										placeholder="145 Zagmiz Heights"
										className="mt-2"
									/>
								</div>
								<div>
									<Label htmlFor="billing-city">City</Label>
									<Input
										id="billing-city"
										placeholder="Tipjabhe"
										className="mt-2"
									/>
								</div>
								<div>
									<Label htmlFor="billing-state">
										State/Province
									</Label>
									<Input
										id="billing-state"
										placeholder="Tuvuz Court"
										className="mt-2"
									/>
								</div>
								<div>
									<Label htmlFor="billing-zip">
										ZIP/Postal Code
									</Label>
									<Input
										id="billing-zip"
										placeholder="12345"
										className="mt-1"
									/>
								</div>
								<div>
									<Label htmlFor="billing-country">
										Country
									</Label>
									<Select>
										<SelectTrigger className="mt-1 w-full">
											<SelectValue placeholder="Select country" />
										</SelectTrigger>
										<SelectContent>
											{countries.map((country) => (
												<SelectItem
													key={country.code}
													value={country.code}
												>
													{country.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</div>
						</Card>

						<div className="flex items-center space-x-2">
							<Checkbox id="terms" />
							<Label
								htmlFor="terms"
								className="text-sm leading-relaxed inline-block"
							>
								I agree to the
								<a
									href="#"
									className="text-blue-600 hover:underline mx-1"
								>
									Terms and Conditions
								</a>
								and
								<a
									href="#"
									className="text-blue-600 hover:underline mx-1"
								>
									Privacy Policy
								</a>
								. I understand the cancellation policy and
								booking terms.
							</Label>
						</div>
					</div>
				);

			case 5:
				return (
					<div className="text-center space-y-8">
						<div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
							<Check className="h-12 w-12 text-green-600" />
						</div>

						<div>
							<h2 className="text-3xl font-surfer font-bold text-green-600 mb-4">
								Booking Confirmed!
							</h2>
							<p className="text-xl font-bruno text-gray-600 mb-2">
								Thank you for choosing Parenthesis.
							</p>
							<p className="text-gray-600">
								Your booking reference is:{" "}
								<span className="font-bold text-blue-600">
									ODY-
									{Date.now().toString().slice(-6)}
								</span>
							</p>
						</div>

						<Card className="p-6 bg-blue-50 text-left max-w-md mx-auto">
							<h3 className="font-semibold font-surfer text-lg mb-4">
								What's Next?
							</h3>
							<div className="space-y-3 text-sm">
								<div className="flex items-center">
									<Mail className="h-4 w-4 mr-2 text-blue-600" />
									<span>
										Confirmation email sent to your inbox
									</span>
								</div>
								<div className="flex items-center">
									<Calendar className="h-4 w-4 mr-2 text-blue-600" />
									<span>
										Travel documents will be sent 7 days
										before departure
									</span>
								</div>
								<div className="flex items-center">
									<Phone className="h-4 w-4 mr-2 text-blue-600" />
									<span>
										Our team will contact you within 24
										hours
									</span>
								</div>
							</div>
						</Card>

						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button asChild>
								<Link href="/profile">View My Bookings</Link>
							</Button>
							<Button asChild variant="outline">
								<Link href="/">Back to Home</Link>
							</Button>
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen pt-20 bg-[#CDC8BC]">
			<section className="first-section flex flex-col justify-center items-center text-amber-50 rounded-br-[100px] py-10 bg-secondary">
				<h1 className="text-4xl md:text-[6vw] font-bold font-surfer animate-fade-up">
					Book Your Dream Trip
				</h1>
				<p className="text-sm px-6 w-full md:text-[1.5vw] mt-4 text-center animate-fade-up">
					Complete your booking in just a few simple steps
				</p>

				<div className="my-8 max-w-7xl mx-auto px-4">
					<div className="flex items-center justify-between flex-wrap gap-4">
						{steps.map((step, index) => {
							const Icon = step.icon;
							const isActive = currentStep === step.number;
							const isCompleted = currentStep > step.number;

							return (
								<div
									key={step.number}
									className="flex items-center"
								>
									<div
										className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
											isCompleted
												? "bg-green-600 border-green-700"
												: isActive
												? "border-yellow-500 text-primary"
												: "border-muted-foreground text-muted-foreground"
										}`}
									>
										{isCompleted ? (
											<Icon className="w-5 h-5" />
										) : (
											<Icon
												className={`${
													isActive
														? "text-yellow-500"
														: ""
												}`}
											/>
										)}
									</div>
									<div className="ml-3">
										<p
											className={`text-xl font-bruno font-semibold ${
												isActive
													? "text-yellow-500"
													: isCompleted
													? "text-green-500"
													: "text-muted-foreground"
											}`}
										>
											Step {step.number}
										</p>
										<p
											className={`text-sm ${
												isActive
													? "text-yellow-500/75"
													: isCompleted
													? "text-green-500/50"
													: "text-muted-foreground"
											}`}
										>
											{step.title}
										</p>
									</div>
									{index < steps.length - 1 && (
										<div
											className={`flex-1 h-0.5 mx-4 ${
												isCompleted
													? "bg-primary"
													: "bg-muted"
											}`}
										/>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</section>

			<section className="wrapper py-12">
				<div className="mx-auto max-w-7xl">
					<Card className="shadow-xl bg-background">
						<CardContent className="p-4 md:p-8">
							{renderContent()}

							{currentStep < 5 && (
								<div className="flex justify-between pt-8 border-t mt-8">
									<Button
										variant="outline"
										onClick={prevStep}
										disabled={currentStep === 1}
										className="flex items-center bg-transparent"
									>
										<ArrowLeft className="h-4 w-4 mr-2" />
										Previous
									</Button>

									{currentStep < 4 ? (
										<Button
											onClick={nextStep}
											disabled={
												(currentStep === 1 &&
													(!bookingData.selectedTrip ||
														!bookingData.travelDates
															.departure ||
														!bookingData.travelDates
															.return)) ||
												(currentStep === 2 && false) ||
												(currentStep === 3 && false)
											}
											className="flex items-center"
										>
											Next
											<ArrowRight className="h-4 w-4 ml-2" />
										</Button>
									) : (
										<Button
											onClick={handleSubmit}
											disabled={
												isSubmitting ||
												!bookingData.paymentMethod
											}
											className="flex items-center bg-green-600 hover:bg-green-700"
										>
											{isSubmitting ? (
												<>
													<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
													Processing...
												</>
											) : (
												<>
													<CreditCard className="h-4 w-4 mr-2" />
													Complete Booking
												</>
											)}
										</Button>
									)}
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</section>
		</div>
	);
}
