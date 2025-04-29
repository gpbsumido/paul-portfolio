import { NextResponse } from "next/server";
import { deleteObject } from "@aws-sdk/client-s3";
import { s3Client } from "@/lib/s3";

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        // Get the image URL from the database
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/gallery/${id}`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch image details");
        }
        const image = await response.json();

        // Extract the key from the S3 URL
        const url = new URL(image.imageUrl);
        const key = url.pathname.substring(1); // Remove leading slash

        // Delete from S3
        await s3Client.send(
            new deleteObject({
                Bucket: process.env.AWS_BUCKET_NAME!,
                Key: key,
            })
        );

        // Delete from database
        const deleteResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/gallery/${id}`,
            {
                method: "DELETE",
            }
        );

        if (!deleteResponse.ok) {
            throw new Error("Failed to delete image from database");
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting image:", error);
        return NextResponse.json(
            { error: "Failed to delete image" },
            { status: 500 }
        );
    }
}
