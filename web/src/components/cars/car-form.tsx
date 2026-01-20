"use client";

/**
 * CarForm - SHARED form for both ADD and EDIT
 *
 * THIS IS THE KEY TO AVOIDING DUPLICATION!
 *
 * The same form handles both cases:
 * - No car prop → Add mode (empty form)
 * - Car prop → Edit mode (pre-filled form)
 *
 * Benefits:
 * - Single source of truth for car fields
 * - Validation logic in one place
 * - UI consistency between add and edit
 * - Easier maintenance
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Car } from "@prisma/client";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { carFormSchema, type CarFormData, type CarFormInput } from "@/lib/validations/car";
import { createCar, updateCar } from "@/actions/cars";

interface CarFormProps {
  car?: Car; // If provided, we're in edit mode
}

export function CarForm({ car }: CarFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Determine mode
  const isEditMode = !!car;

  // Initialize form with either car data (edit) or defaults (add)
  // Use CarFormInput (the input type) since form accepts raw values before Zod transforms
  const form = useForm<CarFormInput>({
    resolver: zodResolver(carFormSchema),
    defaultValues: car
      ? {
          // Edit mode: populate from existing car
          make: car.make,
          model: car.model,
          year: car.year,
          miles: car.miles,
          color: car.color,
          interiorColor: car.interiorColor,
          price: car.price,
          vin: car.vin,
          highlights: car.highlights,
          description: car.description,
          carfax: car.carfax,
          engine: car.engine,
          transmission: car.transmission,
          stockNumber: car.stockNumber,
          picture: car.picture,
          morePictures: car.morePictures,
          video: car.video,
          video2: car.video2,
          banner: car.banner,
          carfaxFile: car.carfaxFile,
          sold: car.sold,
        }
      : {
          // Add mode: empty defaults
          make: "",
          model: "",
          year: "",
          miles: "",
          color: "",
          interiorColor: "",
          price: "",
          vin: "",
          highlights: "",
          description: "",
          carfax: "",
          engine: "",
          transmission: "",
          stockNumber: "",
          picture: null,
          morePictures: null,
          video: "",
          video2: "",
          banner: "",
          carfaxFile: null,
          sold: false,
        },
  });

  // Data is typed as CarFormInput but zodResolver transforms it to CarFormData
  async function onSubmit(data: CarFormInput) {
    setIsSubmitting(true);

    try {
      // Call appropriate action based on mode
      const result = isEditMode
        ? await updateCar(car.id, data)
        : await createCar(data);

      if (result.error) {
        toast.error(result.error);
        if (result.details) {
          // Show field-specific errors
          Object.entries(result.details).forEach(([field, errors]) => {
            if (Array.isArray(errors)) {
              form.setError(field as keyof CarFormInput, {
                message: errors[0],
              });
            }
          });
        }
      } else {
        toast.success(isEditMode ? "Vehicle updated!" : "Vehicle added!");
        router.push("/admin");
        router.refresh();
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Back Button */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Inventory
            </Link>
          </Button>
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Basic Information</h2>
          <Separator />

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year *</FormLabel>
                  <FormControl>
                    <Input placeholder="2024" maxLength={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="make"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Make *</FormLabel>
                  <FormControl>
                    <Input placeholder="Porsche" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model *</FormLabel>
                  <FormControl>
                    <Input placeholder="911 Carrera" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input placeholder="$75,000 or Inquire" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="miles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mileage</FormLabel>
                  <FormControl>
                    <Input placeholder="25,000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Details</h2>
          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exterior Color</FormLabel>
                  <FormControl>
                    <Input placeholder="Guards Red" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interiorColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interior Color</FormLabel>
                  <FormControl>
                    <Input placeholder="Black Leather" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="engine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Engine</FormLabel>
                  <FormControl>
                    <Input placeholder="3.0L Twin-Turbo Flat-6" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transmission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transmission</FormLabel>
                  <FormControl>
                    <Input placeholder="8-Speed PDK" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VIN</FormLabel>
                  <FormControl>
                    <Input placeholder="WP0AB2A99KS123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stockNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Number</FormLabel>
                  <FormControl>
                    <Input placeholder="AMC-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Description & Highlights */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Description</h2>
          <Separator />

          <FormField
            control={form.control}
            name="highlights"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Highlights</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Key features and selling points..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Brief bullet points of key features
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Detailed description of the vehicle..."
                    className="min-h-[200px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Media - TODO: Add Filestack integration */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Media</h2>
          <Separator />

          <div className="rounded-lg border border-dashed p-6 text-center">
            <p className="text-muted-foreground">
              Image upload will be integrated with Filestack.
              <br />
              For now, images can be managed through the existing system.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="video"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://youtube.com/watch?v=..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>YouTube or Vimeo URL</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="video2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL 2</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://youtube.com/watch?v=..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="carfax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carfax URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://carfax.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Status */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Status</h2>
          <Separator />

          <FormField
            control={form.control}
            name="sold"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Mark as Sold</FormLabel>
                  <FormDescription>
                    Sold vehicles appear in the &quot;Sold&quot; section
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href="/admin">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? "Updating..." : "Adding..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditMode ? "Update Vehicle" : "Add Vehicle"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
