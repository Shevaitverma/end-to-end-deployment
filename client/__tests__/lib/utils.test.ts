import { cn, formatDate, priorityOrder } from "@/lib/utils";

describe("cn", () => {
  it("merges multiple class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles empty inputs", () => {
    expect(cn()).toBe("");
  });

  it("handles undefined and null values", () => {
    expect(cn("foo", undefined, null, "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn("base", isActive && "active", isDisabled && "disabled")).toBe(
      "base active"
    );
  });

  it("resolves Tailwind conflicts by keeping the last class", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("resolves conflicting Tailwind color classes", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("merges non-conflicting Tailwind classes", () => {
    expect(cn("px-2", "py-4", "text-sm")).toBe("px-2 py-4 text-sm");
  });

  it("handles array inputs via clsx", () => {
    expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
  });

  it("handles object inputs via clsx", () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
  });
});

describe("formatDate", () => {
  it("formats a valid ISO date string", () => {
    // Use a fixed date: Jan 15, 2024 at 14:30 UTC
    const result = formatDate("2024-01-15T14:30:00.000Z");
    // The output depends on the local timezone, but should contain the month abbreviation and year
    expect(result).toMatch(/Jan/);
    expect(result).toMatch(/15/);
    expect(result).toMatch(/2024/);
  });

  it("formats another valid date string", () => {
    const result = formatDate("2023-12-25T08:00:00.000Z");
    expect(result).toMatch(/Dec/);
    expect(result).toMatch(/25/);
    expect(result).toMatch(/2023/);
  });

  it("includes time with hour and minute", () => {
    const result = formatDate("2024-06-01T09:05:00.000Z");
    // Should contain a colon separating hour and minute (e.g. "9:05" or "2:05")
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });

  it("uses en-US short month format", () => {
    const result = formatDate("2024-03-10T12:00:00.000Z");
    expect(result).toMatch(/Mar/);
  });

  it("formats a date at midnight UTC", () => {
    const result = formatDate("2024-07-04T00:00:00.000Z");
    expect(result).toMatch(/Jul/);
    expect(result).toMatch(/2024/);
  });
});

describe("priorityOrder", () => {
  it('returns 3 for "high"', () => {
    expect(priorityOrder("high")).toBe(3);
  });

  it('returns 2 for "medium"', () => {
    expect(priorityOrder("medium")).toBe(2);
  });

  it('returns 1 for "low"', () => {
    expect(priorityOrder("low")).toBe(1);
  });

  it("returns 0 for an unknown priority", () => {
    expect(priorityOrder("unknown")).toBe(0);
  });

  it("returns 0 for an empty string", () => {
    expect(priorityOrder("")).toBe(0);
  });

  it("returns 0 for a capitalized variant (case-sensitive)", () => {
    expect(priorityOrder("High")).toBe(0);
    expect(priorityOrder("MEDIUM")).toBe(0);
  });

  it("orders priorities correctly: high > medium > low > unknown", () => {
    const high = priorityOrder("high");
    const medium = priorityOrder("medium");
    const low = priorityOrder("low");
    const unknown = priorityOrder("other");

    expect(high).toBeGreaterThan(medium);
    expect(medium).toBeGreaterThan(low);
    expect(low).toBeGreaterThan(unknown);
  });
});
