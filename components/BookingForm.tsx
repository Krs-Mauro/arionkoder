import { useState, FormEvent, type ReactElement } from "react";
import { BookingFormData, FieldError } from "@/types/domain";
import { validateBookingForm } from "@/lib/validation";
import { Input } from "./Input";
import { Button } from "./Button";

interface BookingFormProps {
  readonly onSubmit: (formData: BookingFormData) => void;
  readonly isLoading: boolean;
}

/**
 * Booking form component with validation
 */
export function BookingForm({
  onSubmit,
  isLoading
}: BookingFormProps): ReactElement {
  const [formData, setFormData] = useState<BookingFormData>({
    clientName: "",
    clientEmail: "",
    date: "",
    time: ""
  });

  const [errors, setErrors] = useState<readonly FieldError[]>([]);
  const [touched, setTouched] = useState<Set<keyof BookingFormData>>(new Set());

  const getFieldError = (field: keyof BookingFormData): string | undefined => {
    if (!touched.has(field)) {
      return undefined;
    }
    return errors.find((e) => e.field === field)?.message;
  };

  const handleChange = (field: keyof BookingFormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: keyof BookingFormData): void => {
    setTouched((prev) => new Set(prev).add(field));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched(new Set(["clientName", "clientEmail", "date", "time"]));

    // Validate form
    const validationResult = validateBookingForm(formData);
    setErrors(validationResult.errors);

    if (validationResult.isValid) {
      onSubmit(formData);
    }
  };

  const nameError = getFieldError("clientName");
  const emailError = getFieldError("clientEmail");
  const dateError = getFieldError("date");
  const timeError = getFieldError("time");

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        label="Full Name"
        type="text"
        value={formData.clientName}
        onChange={(e): void => handleChange("clientName", e.target.value)}
        onBlur={(): void => handleBlur("clientName")}
        {...(nameError !== undefined ? { error: nameError } : {})}
        required
        disabled={isLoading}
        placeholder="John Doe"
      />

      <Input
        label="Email Address"
        type="email"
        value={formData.clientEmail}
        onChange={(e): void => handleChange("clientEmail", e.target.value)}
        onBlur={(): void => handleBlur("clientEmail")}
        {...(emailError !== undefined ? { error: emailError } : {})}
        required
        disabled={isLoading}
        placeholder="john@example.com"
      />

      <Input
        label="Date"
        type="date"
        value={formData.date}
        onChange={(e): void => handleChange("date", e.target.value)}
        onBlur={(): void => handleBlur("date")}
        {...(dateError !== undefined ? { error: dateError } : {})}
        required
        disabled={isLoading}
      />

      <Input
        label="Time"
        type="time"
        value={formData.time}
        onChange={(e): void => handleChange("time", e.target.value)}
        onBlur={(): void => handleBlur("time")}
        {...(timeError !== undefined ? { error: timeError } : {})}
        required
        disabled={isLoading}
      />

      <Button type="submit" fullWidth isLoading={isLoading}>
        Confirm Booking
      </Button>
    </form>
  );
}
