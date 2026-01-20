"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Car } from "@prisma/client";
import { MoreHorizontal, Pencil, Trash2, Eye, Tag } from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, getCarTitle, getFilestackUrl } from "@/lib/utils";
import { deleteCar, toggleCarSold } from "@/actions/cars";

interface AdminCarTableProps {
  cars: Car[];
}

export function AdminCarTable({ cars }: AdminCarTableProps) {
  const [isLoading, setIsLoading] = React.useState<string | null>(null);

  const handleToggleSold = async (car: Car) => {
    setIsLoading(car.id);
    try {
      const result = await toggleCarSold(car.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          result.sold ? "Marked as sold" : "Marked as available"
        );
      }
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsLoading(null);
    }
  };

  const handleDelete = async (car: Car) => {
    if (!confirm(`Are you sure you want to delete ${getCarTitle(car)}?`)) {
      return;
    }

    setIsLoading(car.id);
    try {
      const result = await deleteCar(car.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Vehicle deleted");
      }
    } catch (error) {
      toast.error("Failed to delete vehicle");
    } finally {
      setIsLoading(null);
    }
  };

  if (cars.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No vehicles in inventory.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/cars/new">Add your first vehicle</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Stock #</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cars.map((car) => {
            const picture = car.picture as { url?: string; handle?: string } | null;
            const imageUrl = getFilestackUrl(picture, { width: 100, height: 75, fit: "crop" });

            return (
              <TableRow key={car.id}>
                {/* Thumbnail */}
                <TableCell>
                  <div className="relative h-12 w-16 overflow-hidden rounded bg-muted">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={getCarTitle(car)}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        No img
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Vehicle Info */}
                <TableCell>
                  <Link
                    href={`/admin/cars/${car.id}`}
                    className="font-medium hover:underline"
                  >
                    {getCarTitle(car)}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {car.color !== "N/A" ? car.color : ""}
                  </p>
                </TableCell>

                {/* Price */}
                <TableCell>{formatPrice(car.price)}</TableCell>

                {/* Status */}
                <TableCell>
                  {car.sold ? (
                    <Badge variant="secondary">Sold</Badge>
                  ) : (
                    <Badge variant="default" className="bg-green-600">
                      Available
                    </Badge>
                  )}
                </TableCell>

                {/* Stock Number */}
                <TableCell className="text-muted-foreground">
                  {car.stockNumber !== "N/A" ? car.stockNumber : "-"}
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isLoading === car.id}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/car/${car.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Public Page
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/cars/${car.id}`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleSold(car)}>
                        <Tag className="mr-2 h-4 w-4" />
                        {car.sold ? "Mark Available" : "Mark Sold"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(car)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
