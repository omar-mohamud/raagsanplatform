import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import cloudinary from "@/lib/cloudinary";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: "Unauthorized" 
    }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { folder = "raagsan", upload_preset } = await request.json();
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = upload_preset ? { timestamp, upload_preset, folder } : { timestamp, folder };
    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);
    return new Response(JSON.stringify({ success: true, timestamp, folder, upload_preset, signature, cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}


