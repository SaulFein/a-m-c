import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactForm } from "./contact-form";

export const metadata = {
  title: "Contact",
  description: "Contact Authentic Motorcars - Redmond, WA",
};

/**
 * Contact Page
 *
 * Displays contact information and a contact form.
 * The form is a client component (ContactForm) for interactivity.
 */
export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="mt-2 text-muted-foreground">
          We&apos;d love to hear from you
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Contact Information */}
        <div className="space-y-6">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-xl font-semibold">Get in Touch</h2>

            <div className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-muted-foreground">
                    17351 NE 70th Street
                    <br />
                    Redmond, WA 98052
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Phone</p>
                  <a
                    href="tel:+14255551234"
                    className="text-muted-foreground hover:text-primary"
                  >
                    (425) 555-1234
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Email</p>
                  <a
                    href="mailto:sales@authenticmotorcars.com"
                    className="text-muted-foreground hover:text-primary"
                  >
                    sales@authenticmotorcars.com
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3">
                <Clock className="mt-1 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Hours</p>
                  <p className="text-muted-foreground">
                    Monday - Friday: 9am - 6pm
                    <br />
                    Saturday: 10am - 5pm
                    <br />
                    Sunday: By Appointment
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="aspect-video overflow-hidden rounded-lg border bg-muted">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2686.832033033844!2d-122.12!3d47.67!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDQwJzEyLjAiTiAxMjLCsDA3JzEyLjAiVw!5e0!3m2!1sen!2sus!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Authentic Motorcars Location"
            />
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Send a Message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
