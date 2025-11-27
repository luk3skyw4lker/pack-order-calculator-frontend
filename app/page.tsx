'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Package, ShoppingCart, Loader2, Pencil, Check, X } from 'lucide-react';

export default function Home() {
	const [packSize, setPackSize] = useState('');
	const [itemsCount, setItemsCount] = useState('');
	const [isCreatingPack, setIsCreatingPack] = useState(false);
	const [isCreatingOrder, setIsCreatingOrder] = useState(false);
	const [orders, setOrders] = useState<any[]>([]);
	const [isLoadingOrders, setIsLoadingOrders] = useState(false);
	const [packSizes, setPackSizes] = useState<any[]>([]);
	const [isLoadingPackSizes, setIsLoadingPackSizes] = useState(false);
	const [editingPackId, setEditingPackId] = useState<number | null>(null);
	const [editingPackSize, setEditingPackSize] = useState('');
	const [isUpdatingPack, setIsUpdatingPack] = useState(false);
	const { toast } = useToast();

	const BASE_BACKEND_URL = process.env.NEXT_PUBLIC_BASE_BACKEND_URL || '';

	const fetchOrders = async () => {
		setIsLoadingOrders(true);
		try {
			const response = await fetch(`${BASE_BACKEND_URL}/orders`);

			if (!response.ok) {
				throw new Error(`Failed to fetch orders: ${response.statusText}`);
			}

			const data = await response.json();
			setOrders(data);
		} catch (error) {
			toast({
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'Failed to fetch orders',
				variant: 'destructive'
			});
		} finally {
			setIsLoadingOrders(false);
		}
	};

	const fetchPackSizes = async () => {
		setIsLoadingPackSizes(true);
		try {
			const response = await fetch(`${BASE_BACKEND_URL}/pack-sizes`);

			if (!response.ok) {
				throw new Error(`Failed to fetch pack sizes: ${response.statusText}`);
			}

			const data = await response.json();
			setPackSizes(data);
		} catch (error) {
			toast({
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'Failed to fetch pack sizes',
				variant: 'destructive'
			});
		} finally {
			setIsLoadingPackSizes(false);
		}
	};

	useEffect(() => {
		fetchOrders();
		fetchPackSizes();
	}, []);

	const handleCreatePackSize = async (e: React.FormEvent) => {
		e.preventDefault();

		const parsedPackSize = Number.parseInt(packSize);
		if (isNaN(parsedPackSize) || parsedPackSize <= 0) {
			toast({
				title: 'Error',
				description: 'Please enter a valid positive number',
				variant: 'destructive'
			});
			return;
		}

		setIsCreatingPack(true);

		try {
			const response = await fetch(`${BASE_BACKEND_URL}/pack-sizes`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ size: parsedPackSize })
			});

			if (!response.ok) {
				throw new Error(`Failed to create pack size: ${response.statusText}`);
			}

			const data = await response.json();

			toast({
				title: 'Success',
				description: 'Pack size created successfully'
			});

			setPackSize('');
			fetchPackSizes();
		} catch (error) {
			toast({
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'Failed to create pack size',
				variant: 'destructive'
			});
		} finally {
			setIsCreatingPack(false);
		}
	};

	const handleCreateOrder = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!itemsCount.trim()) {
			toast({
				title: 'Error',
				description: 'Please enter items count',
				variant: 'destructive'
			});
			return;
		}

		const count = Number.parseInt(itemsCount);
		if (isNaN(count) || count <= 0) {
			toast({
				title: 'Error',
				description: 'Please enter a valid positive number',
				variant: 'destructive'
			});
			return;
		}

		setIsCreatingOrder(true);

		try {
			const response = await fetch(`${BASE_BACKEND_URL}/orders`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ items_count: count })
			});

			if (!response.ok) {
				throw new Error(`Failed to create order: ${response.statusText}`);
			}

			const data = await response.json();

			toast({
				title: 'Success',
				description: 'Order created successfully'
			});

			setItemsCount('');
			fetchOrders();
		} catch (error) {
			toast({
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'Failed to create order',
				variant: 'destructive'
			});
		} finally {
			setIsCreatingOrder(false);
		}
	};

	const handleEditPack = (pack: any) => {
		setEditingPackId(pack.id);
		setEditingPackSize(pack.size.toString());
	};

	const handleCancelEdit = () => {
		setEditingPackId(null);
		setEditingPackSize('');
	};

	const handleUpdatePackSize = async (packId: number) => {
		const parsedPackSize = Number.parseInt(editingPackSize);
		if (isNaN(parsedPackSize) || parsedPackSize <= 0) {
			toast({
				title: 'Error',
				description: 'Please enter a valid positive number',
				variant: 'destructive'
			});
			return;
		}

		setIsUpdatingPack(true);

		try {
			const response = await fetch(`${BASE_BACKEND_URL}/pack-sizes/${packId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ size: parsedPackSize })
			});

			if (!response.ok) {
				throw new Error(`Failed to update pack size: ${response.statusText}`);
			}

			toast({
				title: 'Success',
				description: 'Pack size updated successfully'
			});

			setEditingPackId(null);
			setEditingPackSize('');
			fetchPackSizes();
		} catch (error) {
			toast({
				title: 'Error',
				description:
					error instanceof Error ? error.message : 'Failed to update pack size',
				variant: 'destructive'
			});
		} finally {
			setIsUpdatingPack(false);
		}
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="border-b bg-card">
				<div className="container mx-auto px-4 py-6">
					<h1 className="text-3xl font-bold text-foreground">
						Inventory Manager
					</h1>
					<p className="text-muted-foreground mt-1">
						Manage pack sizes and create orders
					</p>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
				<div className="grid gap-8 md:grid-cols-2">
					{/* Pack Sizes Section */}
					<Card className="border-border">
						<CardHeader className="space-y-1 pb-4">
							<div className="flex items-center gap-2">
								<div className="rounded-lg bg-primary/10 p-2">
									<Package className="h-5 w-5 text-primary" />
								</div>
								<CardTitle className="text-2xl">Pack Sizes</CardTitle>
							</div>
							<CardDescription>
								Configure pack size options for your inventory
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleCreatePackSize} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="pack-size" className="text-sm font-medium">
										Pack Size
									</Label>
									<Input
										id="pack-size"
										type="text"
										placeholder="e.g., 250"
										value={packSize}
										onChange={e => setPackSize(e.target.value)}
										disabled={isCreatingPack}
										className="h-10"
									/>
									<p className="text-xs text-muted-foreground">
										Enter a numeric or descriptive pack size value, only one
										number at a time
									</p>
								</div>
								<Button
									type="submit"
									className="w-full"
									disabled={isCreatingPack}
								>
									{isCreatingPack ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Creating...
										</>
									) : (
										'Create Pack Size'
									)}
								</Button>
							</form>
						</CardContent>
					</Card>

					{/* Orders Section */}
					<Card className="border-border">
						<CardHeader className="space-y-1 pb-4">
							<div className="flex items-center gap-2">
								<div className="rounded-lg bg-primary/10 p-2">
									<ShoppingCart className="h-5 w-5 text-primary" />
								</div>
								<CardTitle className="text-2xl">Create Order</CardTitle>
							</div>
							<CardDescription>
								Submit new orders to your inventory system
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleCreateOrder} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="items-count" className="text-sm font-medium">
										Items Count
									</Label>
									<Input
										id="items-count"
										type="number"
										placeholder="e.g., 100"
										value={itemsCount}
										onChange={e => setItemsCount(e.target.value)}
										disabled={isCreatingOrder}
										className="h-10"
										min="1"
									/>
									<p className="text-xs text-muted-foreground">
										Enter the number of items for this order
									</p>
								</div>
								<Button
									type="submit"
									className="w-full"
									disabled={isCreatingOrder}
								>
									{isCreatingOrder ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Creating...
										</>
									) : (
										'Create Order'
									)}
								</Button>
							</form>
						</CardContent>
					</Card>
				</div>

				{/* Available Pack Sizes Section */}
				<Card className="mt-8 border-border">
					<CardHeader className="space-y-1 pb-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="rounded-lg bg-primary/10 p-2">
									<Package className="h-5 w-5 text-primary" />
								</div>
								<CardTitle className="text-2xl">Available Pack Sizes</CardTitle>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={fetchPackSizes}
								disabled={isLoadingPackSizes}
							>
								{isLoadingPackSizes ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Refreshing...
									</>
								) : (
									'Refresh'
								)}
							</Button>
						</div>
						<CardDescription>
							View all available pack sizes in your inventory system
						</CardDescription>
					</CardHeader>
					<CardContent>
						{isLoadingPackSizes && packSizes?.length === 0 ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
							</div>
						) : packSizes === null || packSizes.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								<p>No pack sizes found</p>
								<p className="text-sm mt-1">
									Create your first pack size to get started
								</p>
							</div>
						) : (
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
								{packSizes.map((pack, index) => (
									<div
										key={pack.id || index}
										className="rounded-lg border border-border bg-card p-4 hover:bg-accent/50 transition-colors"
									>
										{editingPackId === pack.id ? (
											<div className="space-y-2">
												<Input
													type="number"
													value={editingPackSize}
													onChange={e => setEditingPackSize(e.target.value)}
													className="h-8 text-center"
													min="1"
													disabled={isUpdatingPack}
												/>
												<div className="flex gap-1">
													<Button
														size="sm"
														variant="default"
														className="flex-1 h-7"
														onClick={() => handleUpdatePackSize(pack.id)}
														disabled={isUpdatingPack}
													>
														{isUpdatingPack ? (
															<Loader2 className="h-3 w-3 animate-spin" />
														) : (
															<Check className="h-3 w-3" />
														)}
													</Button>
													<Button
														size="sm"
														variant="outline"
														className="flex-1 h-7"
														onClick={handleCancelEdit}
														disabled={isUpdatingPack}
													>
														<X className="h-3 w-3" />
													</Button>
												</div>
											</div>
										) : (
											<div className="text-center relative group">
												<div className="text-2xl font-bold text-primary">
													{pack.size}
												</div>
												<div className="text-xs text-muted-foreground mt-1">
													items
												</div>
												<Button
													size="sm"
													variant="ghost"
													className="absolute top-0 right-0 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
													onClick={() => handleEditPack(pack)}
												>
													<Pencil className="h-3 w-3" />
												</Button>
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Orders List Section */}
				<Card className="mt-8 border-border">
					<CardHeader className="space-y-1 pb-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div className="rounded-lg bg-primary/10 p-2">
									<ShoppingCart className="h-5 w-5 text-primary" />
								</div>
								<CardTitle className="text-2xl">All Orders</CardTitle>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={fetchOrders}
								disabled={isLoadingOrders}
							>
								{isLoadingOrders ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Refreshing...
									</>
								) : (
									'Refresh'
								)}
							</Button>
						</div>
						<CardDescription>
							View all orders from your inventory system
						</CardDescription>
					</CardHeader>
					<CardContent>
						{isLoadingOrders && orders?.length === 0 ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
							</div>
						) : orders === null || orders.length === 0 ? (
							<div className="text-center py-8 text-muted-foreground">
								<p>No orders found</p>
								<p className="text-sm mt-1">
									Create your first order to get started
								</p>
							</div>
						) : (
							<div className="space-y-3">
								{orders.map((order, index) => (
									<div
										key={order.id || index}
										className="rounded-lg border border-border bg-card p-4 hover:bg-accent/50 transition-colors"
									>
										<div className="flex items-start justify-between gap-4">
											<div className="flex-1">
												<div className="flex items-center gap-2 mb-2">
													<span className="text-sm font-medium">
														Order #{order.id || index + 1}
													</span>
												</div>
												<div className="text-sm text-muted-foreground space-y-1">
													<div className="flex items-center gap-2">
														<span className="font-medium text-foreground">
															Items:
														</span>
														<span>{order.items_count}</span>
													</div>
													{order.pack_setup && (
														<div className="flex items-start gap-2">
															<span className="font-medium text-foreground">
																Pack Setup:
															</span>
															<span className="flex-1">{order.pack_setup}</span>
														</div>
													)}
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>

			<Toaster />
		</div>
	);
}
