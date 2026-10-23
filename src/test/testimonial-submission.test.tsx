import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { TestimonialSubmission } from "@/components/site/TestimonialSubmission";

afterEach(() => localStorage.clear());
it("saves client feedback for review without publishing it", () => {
  render(<TestimonialSubmission />);
  fireEvent.click(screen.getByRole("button", { name: /share your experience/i }));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText("Your name"), { target: { value: "Client Example" } });
  fireEvent.change(screen.getByLabelText(/email address/i), {
    target: { value: "client@example.com" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: /your experience/i }), {
    target: { value: "Practical training that helped our team." },
  });
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: /submit testimonial/i }));
  expect(screen.getByRole("status")).toHaveTextContent("It has not been sent or published");
  const submissions = JSON.parse(localStorage.getItem("sentinel-testimonial-submissions")!);
  expect(submissions[0]).toMatchObject({
    name: "Client Example",
    status: "pending-review",
    consent: true,
  });
  expect(localStorage.getItem("sentinel-cms-releases:testimonials:testimonials")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: /back to testimonials/i }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
