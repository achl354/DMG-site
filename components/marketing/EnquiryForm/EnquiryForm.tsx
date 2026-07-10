"use client";

import { FormEvent, useState } from "react";
import { Input, Select, Textarea, Checkbox, Button, Alert } from "@/components/ui";
import { PRODUCT_NAMES } from "@/lib/constants";
import styles from "./EnquiryForm.module.css";

type Status = "idle" | "submitting" | "success" | "error";

export interface EnquiryFormProps {
  defaultProduct?: string;
}

export function EnquiryForm({ defaultProduct }: EnquiryFormProps) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <Alert tone="success" title="Enquiry sent">
        Thanks — a member of the JD Healthcare Group team will be in touch shortly.
      </Alert>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {status === "error" && (
        <Alert tone="danger" title="Something went wrong">
          Your enquiry could not be sent. Please try again, or email us directly.
        </Alert>
      )}

      <div className={styles.row}>
        <Input label="Full name" name="name" required autoComplete="name" />
        <Input label="Email" name="email" type="email" required autoComplete="email" />
      </div>

      <div className={styles.row}>
        <Input label="Phone" name="phone" type="tel" autoComplete="tel" />
        <Input label="Organisation" name="organisation" autoComplete="organization" />
      </div>

      <Select
        label="Product of interest"
        name="product"
        defaultValue={defaultProduct && PRODUCT_NAMES[defaultProduct] ? defaultProduct : ""}
      >
        <option value="" disabled>
          Select a product
        </option>
        <option value="general">General enquiry</option>
        {Object.entries(PRODUCT_NAMES).map(([slug, name]) => (
          <option key={slug} value={slug}>
            {name}
          </option>
        ))}
      </Select>

      <Textarea
        label="Message"
        name="message"
        required
        placeholder="Tell us about your requirements"
      />

      <Checkbox
        name="consent"
        required
        label="I consent to JD Healthcare Group contacting me about this enquiry."
      />

      <Button type="submit" size="lg" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending..." : "Send enquiry"}
      </Button>
    </form>
  );
}
