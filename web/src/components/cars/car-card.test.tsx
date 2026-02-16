import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CarCard } from "./car-card";

// Mock Next.js components
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    <img alt={alt} src={src} />
  ),
}));

const baseCar = {
  id: "abc123",
  make: "Porsche",
  model: "911",
  year: "2020",
  miles: "15000",
  color: "Black",
  interiorColor: "Tan",
  price: "85000",
  vin: "WP0AB2A95LS123456",
  highlights: "N/A",
  description: "N/A",
  carfax: "N/A",
  engine: "3.0L Twin-Turbo",
  transmission: "PDK",
  picture: { handle: "testhandle123" },
  morePictures: null,
  video: "N/A",
  video2: "N/A",
  banner: "",
  sold: false,
  stockNumber: "N/A",
  carfaxFile: null,
  createdAt: new Date("2024-01-01"),
};

describe("CarCard", () => {
  it("renders car title (year make model)", () => {
    render(<CarCard car={baseCar} />);
    expect(screen.getByText("2020 Porsche 911")).toBeInTheDocument();
  });

  it("renders formatted price", () => {
    render(<CarCard car={baseCar} />);
    expect(screen.getByText("$85,000")).toBeInTheDocument();
  });

  it("renders mileage", () => {
    render(<CarCard car={baseCar} />);
    expect(screen.getByText("15,000 miles")).toBeInTheDocument();
  });

  it("renders color and interior color", () => {
    render(<CarCard car={baseCar} />);
    expect(screen.getByText(/Black/)).toBeInTheDocument();
    expect(screen.getByText(/Tan Interior/)).toBeInTheDocument();
  });

  it("links to car detail page by default", () => {
    render(<CarCard car={baseCar} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/car/abc123");
  });

  it("uses custom href when provided", () => {
    render(<CarCard car={baseCar} href="/admin/cars/abc123" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/admin/cars/abc123");
  });

  it("shows SOLD badge when car is sold", () => {
    render(<CarCard car={{ ...baseCar, sold: true }} />);
    expect(screen.getByText("SOLD")).toBeInTheDocument();
  });

  it("does not show SOLD badge when car is not sold", () => {
    render(<CarCard car={baseCar} />);
    expect(screen.queryByText("SOLD")).not.toBeInTheDocument();
  });

  it("hides SOLD badge when showSoldBadge is false", () => {
    render(<CarCard car={{ ...baseCar, sold: true }} showSoldBadge={false} />);
    expect(screen.queryByText("SOLD")).not.toBeInTheDocument();
  });

  it("shows placeholder when no image", () => {
    render(<CarCard car={{ ...baseCar, picture: null }} />);
    expect(screen.getByText("No Image")).toBeInTheDocument();
  });

  it("does not render color when N/A", () => {
    render(<CarCard car={{ ...baseCar, color: "N/A", interiorColor: "N/A" }} />);
    expect(screen.queryByText(/N\/A/)).not.toBeInTheDocument();
  });
});
