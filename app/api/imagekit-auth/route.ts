import Imagekit from "imagekit";
import { NextResponse } from "next/server";

const imagekit = new Imagekit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT as string,
});

export async function GET(request: Request) {
  try {
    const authenticationParameters = NextResponse.json(
      imagekit.getAuthenticationParameters()
    );
    return NextResponse.json(authenticationParameters);
  } catch (e) {
    return NextResponse.json(
      {
        error: "Imagekit auth failed",
      },
      { status: 500 }
    );
  }
}
