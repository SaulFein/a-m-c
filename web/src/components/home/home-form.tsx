"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Home } from "@prisma/client";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
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
import { homeFormSchema, type HomeFormInput } from "@/lib/validations/home";
import { upsertHome } from "@/actions/home";
import { FilestackUpload } from "@/components/filestack-upload";
import { type FilestackFile } from "@/lib/validations/car";

interface HomeFormProps {
  home?: Home | null;
}

export function HomeForm({ home }: HomeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<HomeFormInput>({
    resolver: zodResolver(homeFormSchema),
    defaultValues: home
      ? {
          picture: home.picture as FilestackFile | null,
          morePictures: home.morePictures as FilestackFile[] | null,
        }
      : {
          picture: null,
          morePictures: null,
        },
  });

  async function onSubmit(data: HomeFormInput) {
    setIsSubmitting(true);

    try {
      const result = await upsertHome(data);

      if (result.error) {
        toast.error(result.error);
        if (result.details) {
          Object.entries(result.details).forEach(([field, errors]) => {
            if (Array.isArray(errors)) {
              form.setError(field as keyof HomeFormInput, {
                message: errors[0],
              });
            }
          });
        }
      } else {
        toast.success("Home page updated!");
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

        {/* Main Picture */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Main Picture (Center of Collage)</h2>
          <Separator />

          <FormField
            control={form.control}
            name="picture"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Picture</FormLabel>
                <FormControl>
                  <FilestackUpload
                    value={field.value ? [field.value] : null}
                    onChange={(files) => {
                      const firstFile = Array.isArray(files) ? files[0] : files;
                      field.onChange(firstFile || null);
                    }}
                    multiple={false}
                    maxFiles={1}
                    label="Upload Main Picture"
                  />
                </FormControl>
                <FormDescription>
                  The large center image in the photo collage
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* More Pictures */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Additional Pictures (8 required for collage)</h2>
          <Separator />

          <FormField
            control={form.control}
            name="morePictures"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Collage Pictures</FormLabel>
                <FormControl>
                  <FilestackUpload
                    value={field.value as FilestackFile[] | null}
                    onChange={field.onChange}
                    multiple
                    maxFiles={20}
                    label="Upload Collage Pictures"
                  />
                </FormControl>
                <FormDescription>
                  Upload at least 8 images for the full collage effect. Images 1-4 appear in the corners, images 5-8 appear in the bottom row.
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
