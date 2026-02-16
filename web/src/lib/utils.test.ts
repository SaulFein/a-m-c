import { describe, it, expect } from "vitest";
import {
  formatPrice,
  formatMiles,
  getCarTitle,
  getFilestackUrl,
  isAvailable,
  truncate,
} from "./utils";

describe("formatPrice", () => {
  it("formats numeric price as USD currency", () => {
    expect(formatPrice("25000")).toBe("$25,000");
  });

  it("formats price with existing dollar sign", () => {
    expect(formatPrice("$25,000")).toBe("$25,000");
  });

  it('returns "Inquire" for empty or special values', () => {
    expect(formatPrice("")).toBe("Inquire");
    expect(formatPrice("Inquire")).toBe("Inquire");
    expect(formatPrice("N/A")).toBe("Inquire");
  });

  it("returns original string for non-numeric values", () => {
    expect(formatPrice("Call for price")).toBe("Call for price");
  });
});

describe("formatMiles", () => {
  it("formats numeric miles with commas and suffix", () => {
    expect(formatMiles("45000")).toBe("45,000 miles");
  });

  it("formats miles with existing commas", () => {
    expect(formatMiles("45,000")).toBe("45,000 miles");
  });

  it('returns "N/A" for empty or N/A values', () => {
    expect(formatMiles("")).toBe("N/A");
    expect(formatMiles("N/A")).toBe("N/A");
  });
});

describe("getCarTitle", () => {
  it("combines year, make, and model", () => {
    expect(
      getCarTitle({ year: "2020", make: "Porsche", model: "911" })
    ).toBe("2020 Porsche 911");
  });
});

describe("getFilestackUrl", () => {
  it("returns null for null/undefined input", () => {
    expect(getFilestackUrl(null)).toBeNull();
    expect(getFilestackUrl(undefined)).toBeNull();
  });

  it("builds URL from handle object", () => {
    expect(getFilestackUrl({ handle: "abc123" })).toBe(
      "https://cdn.filestackcontent.com/abc123"
    );
  });

  it("extracts handle from full URL object", () => {
    expect(
      getFilestackUrl({ url: "https://cdn.filestackcontent.com/abc123" })
    ).toBe("https://cdn.filestackcontent.com/abc123");
  });

  it("handles string input", () => {
    expect(getFilestackUrl("abc123")).toBe(
      "https://cdn.filestackcontent.com/abc123"
    );
  });

  it("adds resize transforms when options provided", () => {
    const url = getFilestackUrl({ handle: "abc123" }, { width: 400, height: 300, fit: "crop" });
    expect(url).toContain("resize=width:400,height:300,fit:crop");
    expect(url).toContain("abc123");
  });

  it("adds quality transform when resizing", () => {
    const url = getFilestackUrl({ handle: "abc123" }, { width: 400 });
    expect(url).toContain("output=quality:90");
  });
});

describe("isAvailable", () => {
  it("returns true for valid values", () => {
    expect(isAvailable("Red")).toBe(true);
  });

  it("returns false for N/A, empty, or null", () => {
    expect(isAvailable("N/A")).toBe(false);
    expect(isAvailable("")).toBe(false);
    expect(isAvailable("   ")).toBe(false);
    expect(isAvailable(null)).toBe(false);
    expect(isAvailable(undefined)).toBe(false);
  });
});

describe("truncate", () => {
  it("returns text unchanged if within limit", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("truncates with ellipsis when exceeding limit", () => {
    expect(truncate("hello world", 5)).toBe("hello...");
  });
});
