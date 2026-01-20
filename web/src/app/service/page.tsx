import { Mail, Phone } from "lucide-react";
import { getService } from "@/actions/service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageCarousel } from "./image-carousel";

export const metadata = {
  title: "Service",
  description: "Professional automotive service for classic and exotic vehicles",
};

export default async function ServicePage() {
  const service = await getService();

  // Parse service pictures
  const pictures = service?.servicePictures as Array<{ url?: string; handle?: string }> | null;

  // Parse service list (comma-separated in database)
  const serviceItems = service?.serviceList
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) || [];

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative h-[300px] w-full overflow-hidden rounded-lg bg-gradient-to-r from-zinc-900 to-zinc-700 md:h-[400px]">
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl">Service</h1>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Image Carousel */}
            {pictures && pictures.length > 0 && (
              <ImageCarousel images={pictures} />
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About Our Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {service?.description || "More info coming soon."}
                </p>
              </CardContent>
            </Card>

            {/* Services List */}
            {serviceItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Services Offered</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {serviceItems.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Special Offers */}
            {service?.special && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="text-primary">Special Going On Now</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{service.special}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Contact */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Have questions about our services? Get in touch with us.
                </p>
                <div className="space-y-3">
                  <a
                    href="mailto:info@authenticmotorcars.com"
                    className="flex items-center gap-3 text-sm hover:text-primary"
                  >
                    <Mail className="h-4 w-4" />
                    info@authenticmotorcars.com
                  </a>
                  <a
                    href="tel:425-440-3880"
                    className="flex items-center gap-3 text-sm hover:text-primary"
                  >
                    <Phone className="h-4 w-4" />
                    (425) 440-3880
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
