import { MOCK_CENTERS, getCenterBySlug, getAllCenterSlugs } from "../mock-data";

describe("Mock Data", () => {
  describe("MOCK_CENTERS", () => {
    it("should have 3 centers", () => {
      expect(MOCK_CENTERS).toHaveLength(3);
    });

    it("should have valid center structure", () => {
      MOCK_CENTERS.forEach((center) => {
        expect(center).toHaveProperty("id");
        expect(center).toHaveProperty("slug");
        expect(center).toHaveProperty("name");
        expect(center).toHaveProperty("description");
        expect(center).toHaveProperty("logo");
        expect(center).toHaveProperty("services");
        expect(Array.isArray(center.services)).toBe(true);
      });
    });

    it("should have valid service structure", () => {
      MOCK_CENTERS.forEach((center) => {
        center.services.forEach((service) => {
          expect(service).toHaveProperty("id");
          expect(service).toHaveProperty("name");
          expect(service).toHaveProperty("description");
          expect(service).toHaveProperty("duration");
          expect(service).toHaveProperty("price");
          expect(service).toHaveProperty("centerId");
          expect(service.centerId).toBe(center.id);
        });
      });
    });

    it("should have prices in cents", () => {
      MOCK_CENTERS.forEach((center) => {
        center.services.forEach((service) => {
          expect(service.price).toBeGreaterThan(0);
          expect(Number.isInteger(service.price)).toBe(true);
        });
      });
    });

    it("should have positive durations", () => {
      MOCK_CENTERS.forEach((center) => {
        center.services.forEach((service) => {
          expect(service.duration).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("getCenterBySlug", () => {
    it("should return center for valid slug", () => {
      const center = getCenterBySlug("bella-vita-spa");
      expect(center).toBeDefined();
      expect(center?.slug).toBe("bella-vita-spa");
      expect(center?.name).toBe("Bella Vita Spa");
    });

    it("should return undefined for invalid slug", () => {
      const center = getCenterBySlug("non-existent-center");
      expect(center).toBeUndefined();
    });

    it("should return correct center for each slug", () => {
      const slugs = ["bella-vita-spa", "radiant-beauty-lounge", "serenity-wellness-center"];
      slugs.forEach((slug) => {
        const center = getCenterBySlug(slug);
        expect(center).toBeDefined();
        expect(center?.slug).toBe(slug);
      });
    });
  });

  describe("getAllCenterSlugs", () => {
    it("should return all center slugs", () => {
      const slugs = getAllCenterSlugs();
      expect(slugs).toHaveLength(3);
      expect(slugs).toContain("bella-vita-spa");
      expect(slugs).toContain("radiant-beauty-lounge");
      expect(slugs).toContain("serenity-wellness-center");
    });

    it("should return slugs in correct order", () => {
      const slugs = getAllCenterSlugs();
      expect(slugs[0]).toBe("bella-vita-spa");
      expect(slugs[1]).toBe("radiant-beauty-lounge");
      expect(slugs[2]).toBe("serenity-wellness-center");
    });
  });
});

