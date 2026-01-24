"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Storage } from "@prisma/client";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { storageFormSchema, type StorageFormInput } from "@/lib/validations/storage";
import { upsertStorage } from "@/actions/storage";
import { FilestackUpload } from "@/components/filestack-upload";
import { type FilestackFile } from "@/lib/validations/car";

interface StorageFormProps {
  storage?: Storage | null;
}

export function StorageForm({ storage }: StorageFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<StorageFormInput>({
    resolver: zodResolver(storageFormSchema),
    defaultValues: storage
      ? {
          description: storage.description,
          serviceList: storage.serviceList,
          special: storage.special ?? "",
          specialTitle: storage.specialTitle ?? "",
          storagePictures: storage.storagePictures as FilestackFile[] | null,
        }
      : {
          description: "",
          serviceList: "",
          special: "",
          specialTitle: "",
          storagePictures: null,
        },
  });

  async function onSubmit(data: StorageFormInput) {
    setIsSubmitting(true);

    try {
      const result = await upsertStorage(data);

      if (result.error) {
        toast.error(result.error);
        if (result.details) {
          Object.entries(result.details).forEach(([field, errors]) => {
            if (Array.isArray(errors)) {
              form.setError(field as keyof StorageFormInput, {
                message: errors[0],
              });
            }
          });
        }
      } else {
        toast.success("Storage page updated!");
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
          <h2 className="text-xl font-semibold">Storage Information</h2>
          <Separator />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter storage description..."
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Main description text shown on the Storage page
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
                    placeholder="List of storage services (comma-separated)..."
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Storage services offered
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Special Offers (Optional) */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Special Offers (Optional)</h2>
          <Separator />

          <FormField
            control={form.control}
            name="specialTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Title (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="SPECIAL GOING ON NOW"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormDescription>
                  Heading for the special offers section
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
            name="storagePictures"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Storage Pictures</FormLabel>
                <FormControl>
                  <FilestackUpload
                    value={field.value as FilestackFile[] | null}
                    onChange={field.onChange}
                    multiple
                    maxFiles={20}
                    label="Upload Storage Pictures"
                  />
                </FormControl>
                <FormDescription>
                  Images to display on the Storage page
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
