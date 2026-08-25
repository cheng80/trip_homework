"use client";

import type { FormEvent } from "react";

export function useProductInquiries() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return { handleSubmit };
}
