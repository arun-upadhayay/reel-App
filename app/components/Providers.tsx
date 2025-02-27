"use client";

import { ImageKitProvider } from "imagekitio-next";
import { SessionProvider } from "next-auth/react";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT as string;
const publicKey = process.env.IMAGEKIT_PUBLIC_KEY as string;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY as string;

export default function Providers({ children }: { children: React.ReactNode }) {
  const authenticator = async () => {
    try {
      const response = await fetch("/api/imagekit-auth", { method: "GET" });
      if (response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Imagekit auth failed: ${errorText} and status code: ${response.status}`
        );
      }

      const data = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (e) {
      console.error(e);
      throw new Error("Imagekit auth failed");
    }
  };

  return (
    <SessionProvider>
      <ImageKitProvider
        urlEndpoint={urlEndpoint}
        publicKey={publicKey}
        authenticator={authenticator}
      ></ImageKitProvider>
    </SessionProvider>
  );
}
