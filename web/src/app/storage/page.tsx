import { Mail, Phone } from "lucide-react";
import { getStorage } from "@/actions/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageCarousel } from "./image-carousel";

export const metadata = {
  title: "Storage",
  description: "Secure heated vehicle storage in the Pacific Northwest",
};

const DEFAULT_DESCRIPTION = `Authentic Motorcars offers secure storage with climate-controlled and heated buildings, 24-hour security cameras, alarm systems, and fire sprinklers.

Our concierge services include:
- Car covering and battery tender service
- Washing and detailing
- Pick-up and delivery

Starting at $350/month.`;

export default async function StoragePage() {
  const storage = await getStorage();

  // Parse storage pictures
  const pictures = storage?.storagePictures as Array<{ url?: string; handle?: string }> | null;

  // Parse service list (comma-separated in database)
  const serviceItems = storage?.serviceList
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) || [];

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative h-[300px] w-full overflow-hidden rounded-lg bg-gradient-to-r from-zinc-900 to-zinc-700 md:h-[400px]">
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl">Storage</h1>
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
                <CardTitle>About Our Storage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {storage?.description || DEFAULT_DESCRIPTION}
                </p>
              </CardContent>
            </Card>

            {/* Services List */}
            {serviceItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Storage Services</CardTitle>
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
            {storage?.special && (
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="text-primary">
                    {storage.specialTitle || "Special Going On Now"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{storage.special}</p>
                </CardContent>
              </Card>
            )}

            {/* MMCBS Partnership */}
            {storage?.mmcbsBlurb && (
              <Card>
                <CardHeader>
                  <CardTitle>{storage.mmcbsTitle || "Outdoor Storage Available"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-muted-foreground">
                    {storage.mmcbsBlurb}
                  </p>
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
                  Interested in storing your vehicle with us? Get in touch.
                </p>
                <div className="space-y-3">
                  <a
                    href="mailto:shannon@authenticmotorcars.com"
                    className="flex items-center gap-3 text-sm hover:text-primary"
                  >
                    <Mail className="h-4 w-4" />
                    shannon@authenticmotorcars.com
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

            {/* Rates Card */}
            <Card>
              <CardHeader>
                <CardTitle>Storage Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">Starting at $350/mo</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Contact us for a custom quote based on your needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
