import { Center } from "@/types/domain";

/**
 * Mock data for beauty centers
 * Prices are stored in cents to avoid floating point issues
 */
export const MOCK_CENTERS: readonly Center[] = [
  {
    id: "center-1",
    slug: "bella-vita-spa",
    name: "Bella Vita Spa",
    description:
      "Experience luxury and relaxation at Bella Vita Spa. Our expert team provides premium beauty treatments in a serene environment.",
    logo: "💆‍♀️",
    services: [
      {
        id: "service-1-1",
        name: "Classic Facial",
        description:
          "Deep cleansing facial with customized treatment for your skin type",
        duration: 60,
        price: 8500, // $85.00
        centerId: "center-1"
      },
      {
        id: "service-1-2",
        name: "Swedish Massage",
        description:
          "Full body relaxation massage to relieve tension and stress",
        duration: 90,
        price: 12000, // $120.00
        centerId: "center-1"
      },
      {
        id: "service-1-3",
        name: "Manicure & Pedicure",
        description: "Complete nail care with polish of your choice",
        duration: 75,
        price: 6500, // $65.00
        centerId: "center-1"
      },
      {
        id: "service-1-4",
        name: "Hair Styling",
        description: "Professional wash, cut, and style",
        duration: 45,
        price: 5500, // $55.00
        centerId: "center-1"
      }
    ]
  },
  {
    id: "center-2",
    slug: "radiant-beauty-lounge",
    name: "Radiant Beauty Lounge",
    description:
      "Modern beauty lounge offering cutting-edge treatments and personalized care. Transform your look with our skilled professionals.",
    logo: "✨",
    services: [
      {
        id: "service-2-1",
        name: "Anti-Aging Facial",
        description:
          "Advanced facial treatment targeting fine lines and wrinkles",
        duration: 75,
        price: 11500, // $115.00
        centerId: "center-2"
      },
      {
        id: "service-2-2",
        name: "Hot Stone Massage",
        description:
          "Therapeutic massage using heated stones for deep relaxation",
        duration: 90,
        price: 13500, // $135.00
        centerId: "center-2"
      },
      {
        id: "service-2-3",
        name: "Gel Manicure",
        description: "Long-lasting gel polish application with nail shaping",
        duration: 45,
        price: 4500, // $45.00
        centerId: "center-2"
      },
      {
        id: "service-2-4",
        name: "Balayage Hair Color",
        description: "Hand-painted highlights for a natural, sun-kissed look",
        duration: 180,
        price: 18500, // $185.00
        centerId: "center-2"
      },
      {
        id: "service-2-5",
        name: "Eyebrow Shaping & Tinting",
        description: "Professional brow shaping and tinting for defined brows",
        duration: 30,
        price: 3500, // $35.00
        centerId: "center-2"
      }
    ]
  },
  {
    id: "center-3",
    slug: "serenity-wellness-center",
    name: "Serenity Wellness Center",
    description:
      "Holistic wellness center combining beauty treatments with mindfulness. Rejuvenate your body, mind, and spirit.",
    logo: "🧘‍♀️",
    services: [
      {
        id: "service-3-1",
        name: "Aromatherapy Massage",
        description:
          "Relaxing massage with essential oils tailored to your needs",
        duration: 60,
        price: 9500, // $95.00
        centerId: "center-3"
      },
      {
        id: "service-3-2",
        name: "Organic Facial",
        description: "Natural facial using organic products for sensitive skin",
        duration: 60,
        price: 9000, // $90.00
        centerId: "center-3"
      },
      {
        id: "service-3-3",
        name: "Reflexology Session",
        description:
          "Foot massage targeting pressure points for overall wellness",
        duration: 45,
        price: 6000, // $60.00
        centerId: "center-3"
      },
      {
        id: "service-3-4",
        name: "Body Scrub & Wrap",
        description: "Exfoliating scrub followed by nourishing body wrap",
        duration: 90,
        price: 11000, // $110.00
        centerId: "center-3"
      }
    ]
  }
] as const;

/**
 * Get a center by its slug
 */
export function getCenterBySlug(slug: string): Center | undefined {
  return MOCK_CENTERS.find((center) => center.slug === slug);
}

/**
 * Get all available center slugs
 */
export function getAllCenterSlugs(): readonly string[] {
  return MOCK_CENTERS.map((center) => center.slug);
}
