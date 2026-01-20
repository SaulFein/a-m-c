"use client";

/**
 * CarInquiryForm - Contact form on car detail page
 *
 * Allows visitors to inquire about a specific car.
 * Sends email to dealership with car info + visitor's message.
 */

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { inquiryFormSchema, type InquiryFormData } from "@/lib/validations/car";
import { sendInquiry } from "@/actions/contact";

interface CarInquiryFormProps {
  carId: string;
  carTitle: string;
}

export function CarInquiryForm({ carId, carTitle }: CarInquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  /**
   * React Hook Form Setup
   *
   * react-hook-form is a popular form library that:
   * - Handles validation (we use Zod)
   * - Manages form state
   * - Minimizes re-renders
   *
   * zodResolver connects Zod schema to react-hook-form.
   * This gives us the same validation on client that we use on server.
   */
  const form = useForm<InquiryFormData>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      comments: "",
      carId,
      carTitle,
    },
  });

  async function onSubmit(data: InquiryFormData) {
    setIsSubmitting(true);

    try {
      const result = await sendInquiry(data);

      if (result.error) {
        toast.error(result.error);
      } else {
        setIsSuccess(true);
        toast.success("Your inquiry has been sent!");
      }
    } catch (error) {
      toast.error("Failed to send inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Show success state after submission
  if (isSuccess) {
    return (
      <div className="py-6 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="mt-4 text-lg font-semibold">Thank you!</h3>
        <p className="mt-2 text-muted-foreground">
          We&apos;ve received your inquiry about the {carTitle}.
          We&apos;ll be in touch soon!
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            setIsSuccess(false);
            form.reset();
          }}
        >
          Send another inquiry
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="(555) 555-5555" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comments</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="I'm interested in this vehicle..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Inquiry
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
