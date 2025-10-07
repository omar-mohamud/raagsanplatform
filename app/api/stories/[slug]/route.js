import { dbConnect } from "@/lib/dbConnect";
import Story from "@/models/Story";
import { assertAdmin } from "@/lib/auth";

export async function GET(_req, { params }) {
  try {
    await dbConnect();
    const story = await Story.findOne({ slug: params.slug });
    if (!story) {
      return new Response(JSON.stringify({ success: false, error: "Not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, data: story }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const unauthorized = assertAdmin(request);
    if (unauthorized) return unauthorized;
    await dbConnect();
    const updates = await request.json();
    const story = await Story.findOneAndUpdate({ slug: params.slug }, updates, { new: true });
    if (!story) {
      return new Response(JSON.stringify({ success: false, error: "Not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true, data: story }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  try {
    const unauthorized = assertAdmin(_req);
    if (unauthorized) return unauthorized;
    await dbConnect();
    const deleted = await Story.findOneAndDelete({ slug: params.slug });
    if (!deleted) {
      return new Response(JSON.stringify({ success: false, error: "Not found" }), { status: 404 });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
}


