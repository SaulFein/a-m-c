"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Service } from "@prisma/client";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { serviceFormSchema, type ServiceFormInput } from "@/lib/validations/service";
import { upsertService } from "@/actions/service";
import { FilestackUpload } from "@/components/filestack-upload";
import { type FilestackFile } from "@/lib/validations/car";

interface ServiceFormProps {
  service?: Service | null;
}

export function ServiceForm({ service }: ServiceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ServiceFormInput>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: service
      ? {
          description: service.description,
          serviceList: service.serviceList,
          special: service.special ?? "",
          servicePictures: service.servicePictures as FilestackFile[] | null,
        }
      : {
          description: "",
          serviceList: "",
          special: "",
          servicePictures: null,
        },
  });

  async function onSubmit(data: ServiceFormInput) {
    setIsSubmitting(true);

    try {
      const result = await upsertService(data);

      if (result.error) {
        toast.error(result.error);
        if (result.details) {
          Object.entries(result.details).forEach(([field, errors]) => {
            if (Array.isArray(errors)) {
              form.setError(field as keyof ServiceFormInput, {
                message: errors[0],
              });
            }
          });
        }
      } else {
        toast.success("Service page updated!");
        router.refresh();
      }
    } catch {
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
              Back to Admin
            </Link>
          </Button>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Service Information</h2>
          <Separator />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter service description..."
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Main description text shown on the Service page
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serviceList"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service List</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List of services (comma-separated)..."
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Services offered (e.g., Oil changes, Brake service, Detailing)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="special"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Offers (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Current special offers or promotions..."
                    className="min-h-[100px]"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormDescription>
                  Special offers or promotions to highlight
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Pictures */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Images</h2>
          <Separator />

          <FormField
            control={form.control}
            name="servicePictures"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Pictures</FormLabel>
                <FormControl>
                  <FilestackUpload
                    value={field.value as FilestackFile[] | null}
                    onChange={field.onChange}
                    multiple
                    maxFiles={20}
                    label="Upload Service Pictures"
                  />
                </FormControl>
                <FormDescription>
                  Images to display on the Service page
                </FormDescription>
                <FormMessage />
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
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
