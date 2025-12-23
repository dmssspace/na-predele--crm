"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function TrainerShowRedirect() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    if (params?.id) {
      router.replace(`/trainers?id=${params.id}`);
    } else {
      router.replace("/trainers");
    }
  }, [params, router]);

  return null;
}
