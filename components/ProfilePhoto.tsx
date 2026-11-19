"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProfilePhoto() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return null;
  }

  return (
    <Image
      src="/profile.png"
      alt="Portrait of Bhoomi Oza"
      width={719}
      height={800}
      priority
      onError={() => setFailed(true)}
      className="h-56 w-56 rounded-full object-cover ring-4 ring-saffron/50 sm:h-72 sm:w-72 lg:h-80 lg:w-80"
    />
  );
}
