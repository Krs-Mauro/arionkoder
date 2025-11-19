import { type ReactElement } from "react";
import { Service } from "@/types/domain";
import { ServiceCard } from "./ServiceCard";

interface CenterServicesProps {
  readonly services: readonly Service[];
  readonly onBook: (serviceId: string) => void;
}

/**
 * Services section component displaying all services in a grid
 */
export function CenterServices({
  services,
  onBook
}: CenterServicesProps): ReactElement {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} onBook={onBook} />
        ))}
      </div>
    </div>
  );
}

