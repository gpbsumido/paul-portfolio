"use client";

import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Fab,
    Modal,
    TextField,
    Container,
    useTheme,
    useMediaQuery,
    IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState, useRef, useCallback } from "react";
import React from "react";
import _ from "lodash";

interface ImageData {
    src: string;
    width: number;
    height: number;
    blurDataURL?: string;
    originalWidth: number;
    originalHeight: number;
}

export default function Gallery(): React.ReactElement | null {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [images, setImages] = useState<ImageData[]>([]);
    const [containerWidth, setContainerWidth] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [text, setText] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [fetchedImages, setFetchedImages] = useState<any[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);
    const imageCache = useRef<
        Record<string, { element: HTMLImageElement; loaded: boolean }>
    >({});
    const lastFetchedPage = useRef<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [deletingImageId, setDeletingImageId] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null); // State to track upload errors
    const [deleteError, setDeleteError] = useState<string | null>(null); // State to track delete errors
    const [fetchError, setFetchError] = useState<string | null>(null); // State to track fetch errors

    const preloadImage = (src: string): Promise<void> => {
        // Skip preloading for unsupported formats like .HEIC
        if (src.toLowerCase().endsWith(".heic")) {
            console.warn(`Skipping unsupported image format: ${src}`);
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve();
            img.onerror = () =>
                reject(new Error(`Failed to preload image: ${src}`));
        });
    };

    const loadImage = useCallback(
        (
            src: string,
            width: number,
            height: number
        ): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
                if (imageCache.current[src]?.loaded) {
                    resolve(imageCache.current[src].element);
                    return;
                }

                if (imageCache.current[src]) {
                    const checkLoaded = () => {
                        if (imageCache.current[src]?.loaded) {
                            resolve(imageCache.current[src].element);
                        } else {
                            setTimeout(checkLoaded, 100);
                        }
                    };
                    checkLoaded();
                    return;
                }

                const img = document.createElement("img") as HTMLImageElement;
                img.src = src;
                img.width = width;
                img.height = height;

                imageCache.current[src] = { element: img, loaded: false };

                img.onload = () => {
                    imageCache.current[src].loaded = true;
                    resolve(img);
                };

                img.onerror = () => {
                    delete imageCache.current[src];
                    reject(new Error("Failed to load image"));
                };
            });
        },
        []
    );

    const ImageComponent = useCallback(
        ({
            image,
            width,
            height,
            index,
        }: {
            image: ImageData;
            width: number;
            height: number;
            index: number;
        }) => {
            const [isLoaded, setIsLoaded] = useState(false);
            const [isVisible, setIsVisible] = useState(index < 3); // Always visible for first 3 images
            const containerRef = useRef<HTMLDivElement>(null);
            const imgRef = useRef<HTMLImageElement | null>(null);

            useEffect(() => {
                if (index < 3) return; // Skip intersection observer for first 3 images

                const observer = new IntersectionObserver(
                    ([entry]) => {
                        if (entry.isIntersecting) {
                            setIsVisible(true);
                            observer.disconnect();
                        }
                    },
                    {
                        threshold: 0.1,
                        rootMargin: index < 6 ? "200px" : "50px", // Larger margin for top images
                    }
                );

                if (containerRef.current) {
                    observer.observe(containerRef.current);
                }

                return () => observer.disconnect();
            }, [index]);

            useEffect(() => {
                if (!isVisible) return;

                const load = async () => {
                    if (imageCache.current[image.src]?.loaded) {
                        setIsLoaded(true);
                        return;
                    }

                    try {
                        const img = new Image();
                        img.src = image.src;

                        img.onload = () => {
                            imageCache.current[image.src] = {
                                element: img,
                                loaded: true,
                            };
                            setIsLoaded(true);
                        };

                        img.onerror = () => {
                            console.error("Error loading image:", image.src);
                            delete imageCache.current[image.src];
                        };
                    } catch (error) {
                        console.error("Error loading image:", error);
                    }
                };

                load();
            }, [image.src, isVisible]);

            return (
                <div
                    ref={containerRef}
                    style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                        overflow: "hidden",
                        backgroundColor: "#111",
                    }}
                >
                    {isVisible && (
                        <>
                            {image.blurDataURL && !isLoaded && (
                                <img
                                    src={image.blurDataURL}
                                    alt=""
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        filter: "blur(20px)",
                                        transform: "scale(1.1)",
                                        objectFit: "cover",
                                    }}
                                />
                            )}
                            <img
                                ref={imgRef}
                                src={image.src}
                                alt="Gallery image"
                                style={{
                                    objectFit: "contain",
                                    width: "100%",
                                    height: "100%",
                                    opacity: isLoaded ? 1 : 0,
                                    transition: "opacity 0.3s ease",
                                    pointerEvents: "none",
                                    willChange: "transform",
                                }}
                                loading={index < 6 ? "eager" : "lazy"}
                            />
                        </>
                    )}
                    {!isLoaded && !image.blurDataURL && (
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                backgroundColor: "#111",
                            }}
                        />
                    )}
                </div>
            );
        },
        []
    );

    const updateWidth = useCallback(() => {
        if (typeof window === "undefined") return;
        const newWidth = Math.min(window.innerWidth - 40, 1200);
        if (newWidth !== containerWidth) {
            setContainerWidth(newWidth);
        }
    }, [containerWidth]);

    useEffect(() => {
        updateWidth();

        let timeout: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                updateWidth();
            }, 200);
        };

        if (typeof window !== "undefined") {
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    }, [updateWidth]);

    const fetchImages = useCallback(
        async (pageNumber: number) => {
            if (
                isFetching ||
                pageNumber <= lastFetchedPage.current ||
                fetchError
            )
                return;

            setIsFetching(true);
            setFetchError(null);
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || ""}/api/gallery?page=${pageNumber}&limit=4`
                );
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.error || "Failed to fetch images"
                    );
                }

                const data = await response.json();
                const formattedImages = await Promise.all(
                    data
                        .filter(
                            (item: { imageUrl: string }) =>
                                !item.imageUrl.toLowerCase().endsWith(".heic")
                        )
                        .map(
                            async (item: {
                                key: string;
                                imageUrl: string;
                                blurDataURL?: string;
                            }) => {
                                if (
                                    pageNumber === 1 &&
                                    data.indexOf(item) < 3
                                ) {
                                    await preloadImage(item.imageUrl);
                                }
                                return {
                                    src: item.imageUrl,
                                    width: 0,
                                    height: 0,
                                    originalWidth: 0,
                                    originalHeight: 0,
                                    blurDataURL: item.blurDataURL,
                                };
                            }
                        )
                );

                setImages((prev) => {
                    const existingUrls = new Set(prev.map((img) => img.src));
                    const uniqueImages = formattedImages.filter(
                        (img) => !existingUrls.has(img.src)
                    );
                    return [...prev, ...uniqueImages];
                });
                setFetchedImages((prev) => [...prev, ...data]);
                setHasMore(formattedImages.length === 4);
                lastFetchedPage.current = pageNumber;
            } catch (error: any) {
                setFetchError(
                    error.message ||
                        "An unexpected error occurred while fetching posts."
                );
            } finally {
                setIsLoading(false);
                setIsFetching(false);
            }
        },
        [isFetching, fetchError]
    );

    useEffect(() => {
        fetchImages(page);
    }, [page, fetchImages]);

    useEffect(() => {
        if (!containerRef.current) return;

        const options = {
            root: null,
            rootMargin: "100px",
            threshold: 0.1,
        };

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore && !isFetching) {
                setPage((prev) => prev + 1);
            }
        }, options);

        observer.current.observe(containerRef.current);

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [hasMore, isFetching]);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        // Reset all form states
        setText("");
        setDescription("");
        setImageFile(null);
        setUploading(false);
        // Close modal last
        setIsModalOpen(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!imageFile) return;
        setUploading(true);
        setUploadError(null);

        const currentDate = new Date();
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("text", text);
        formData.append("description", description);
        formData.append("date", currentDate.toISOString());

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/gallery`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Upload failed");
            }

            const result = await res.json();

            if (!result.image_url) {
                throw new Error("No image URL in response");
            }

            const newImage = {
                src: result.image_url,
                width: 0,
                height: 0,
                originalWidth: result.width || 0,
                originalHeight: result.height || 0,
                blurDataURL: result.blurDataURL,
            };

            const newImageData = {
                id: result.id,
                imageUrl: result.image_url,
                text: text,
                description: description,
                date: currentDate.toISOString(),
                width: result.width || 0,
                height: result.height || 0,
                blurDataURL: result.blurDataURL,
            };

            setImages((prev) => [newImage, ...prev]);
            setFetchedImages((prev) => [newImageData, ...prev]);

            setText("");
            setDescription("");
            setImageFile(null);
            handleCloseModal();
        } catch (err: any) {
            setUploadError(err.message || "An unexpected error occurred");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteImage = async (imageId: string, imageUrl: string) => {
        if (deletingImageId) return; // Prevent multiple delete attempts

        setDeletingImageId(imageId);
        setDeleteError(null); // Reset delete error state
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/gallery/${imageId}`,
                {
                    method: "DELETE",
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete image");
            }

            // Remove the image from both states
            setImages((prev) => prev.filter((img) => img.src !== imageUrl));
            setFetchedImages((prev) =>
                prev.filter((img) => img.id !== imageId)
            );

            // Remove from image cache
            delete imageCache.current[imageUrl];
        } catch (error: any) {
            setDeleteError(
                error.message ||
                    "An unexpected error occurred while deleting the post."
            );
        } finally {
            setDeletingImageId(null);
        }
    };

    return (
        <Box
            component="main"
            sx={{
                padding: "20px",
                width: "100%",
                minHeight: "100vh",
                maxWidth: "1200px",
                margin: "0 auto",
                boxSizing: "border-box",
            }}
        >
            <Typography
                variant="h1"
                sx={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    marginBottom: "1rem",
                    textAlign: "center",
                }}
            >
                Gallery
            </Typography>
            {!images.length && !isLoading && (
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "50vh",
                        textAlign: "center",
                        color: "text.secondary",
                    }}
                >
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        No posts yet.
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3 }}>
                        Be the first to share an image with the community!
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOpenModal}
                    >
                        Upload Image
                    </Button>
                </Box>
            )}

            <Container
                maxWidth="sm"
                sx={{
                    width: "100%",
                    padding: 0,
                    maxWidth: "1200px",
                    margin: "0 auto",
                }}
            >
                <Box ref={containerRef}>
                    {images.map((image, index) => {
                        const imageData = fetchedImages.find(
                            (item) => item.imageUrl === image.src
                        );

                        return (
                            <Box
                                key={image.src}
                                sx={{
                                    width: "100%",
                                    mb: 3,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    position: "relative",
                                }}
                            >
                                <Box
                                    sx={{
                                        position: "relative",
                                        width: "100%",
                                        aspectRatio: `${image.originalWidth} / ${image.originalHeight}`,
                                        overflow: "hidden",
                                        backgroundColor: "#111",
                                        borderRadius: 2,
                                        boxShadow: 2,
                                        "&:hover .delete-button": {
                                            opacity: 1,
                                        },
                                        "&:hover .image-data": {
                                            opacity: 1,
                                        },
                                    }}
                                >
                                    <IconButton
                                        className="delete-button"
                                        onClick={() =>
                                            handleDeleteImage(
                                                imageData.id,
                                                image.src
                                            )
                                        } // Ensure correct ID and URL are passed
                                        disabled={
                                            deletingImageId === imageData?.id
                                        }
                                        sx={{
                                            position: "absolute",
                                            top: 8,
                                            right: 8,
                                            backgroundColor:
                                                "rgba(0, 0, 0, 0.5)",
                                            color: "white",
                                            opacity: 0,
                                            transition: "opacity 0.2s ease",
                                            zIndex: 3,
                                            "&:hover": {
                                                backgroundColor:
                                                    "rgba(0, 0, 0, 0.7)",
                                            },
                                        }}
                                    >
                                        {deletingImageId === imageData?.id ? (
                                            <CircularProgress
                                                size={24}
                                                color="inherit"
                                            />
                                        ) : (
                                            <DeleteIcon />
                                        )}
                                    </IconButton>
                                    {deleteError &&
                                        deletingImageId === imageData?.id && (
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    top: "100%",
                                                    left: 0,
                                                    right: 0,
                                                    bgcolor: "error.light",
                                                    color: "error.contrastText",
                                                    p: 1,
                                                    borderRadius: 1,
                                                    mt: 1,
                                                    zIndex: 4,
                                                }}
                                            >
                                                <Typography variant="body2">
                                                    {deleteError}
                                                </Typography>
                                            </Box>
                                        )}
                                    <ImageComponent
                                        image={image}
                                        width={containerWidth}
                                        height={
                                            containerWidth *
                                            (image.originalHeight /
                                                image.originalWidth)
                                        }
                                        index={index}
                                    />
                                    {(imageData?.text ||
                                        imageData?.description ||
                                        imageData?.date) && (
                                        <Box
                                            className="image-data"
                                            sx={{
                                                position: "absolute",
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                bgcolor: "rgba(0,0,0,0.6)",
                                                color: "#fff",
                                                p: 2,
                                                zIndex: 2,
                                                opacity: 0,
                                                transition: "opacity 0.3s ease",
                                            }}
                                        >
                                            {imageData?.text && (
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {imageData.text}
                                                </Typography>
                                            )}
                                            {imageData?.description && (
                                                <Typography
                                                    variant="body2"
                                                    sx={{ mt: 1 }}
                                                >
                                                    {imageData.description}
                                                </Typography>
                                            )}
                                            {imageData?.date && (
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        display: "block",
                                                        mt: 1,
                                                        opacity: 0.7,
                                                    }}
                                                >
                                                    {new Date(
                                                        imageData.date
                                                    ).toLocaleString(
                                                        undefined,
                                                        {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </Typography>
                                            )}
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>

                {!fetchError && hasMore && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            my: 4,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                )}
            </Container>

            {fetchError && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        bgcolor: "error.light",
                        color: "error.contrastText",
                        p: 2,
                        borderRadius: 1,
                        mb: 2,
                        boxShadow: 2,
                        width: "fit-content",
                        margin: "0 auto",
                        maxWidth: "90%",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 2,
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: "bold",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <span
                                style={{
                                    display: "inline-block",
                                    marginRight: "8px",
                                }}
                            >
                                ⚠️
                            </span>
                            Error
                        </Typography>
                    </Box>
                    <Typography variant="body2">{fetchError}</Typography>
                </Box>
            )}

            <Fab
                color="primary"
                aria-label="add"
                onClick={handleOpenModal}
                sx={{
                    position: "fixed",
                    bottom: { xs: "16px", sm: "32px" },
                    right: { xs: "16px", sm: "32px" },
                    zIndex: 9999,
                    display: !_.isEmpty(images) ? "flex" : "none",
                }}
            >
                <AddIcon />
            </Fab>
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="upload-modal-title"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: "90%", sm: "400px" },
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                    }}
                >
                    <Typography
                        variant="h6"
                        component="h2"
                        id="upload-modal-title"
                        sx={{ textAlign: "center", fontWeight: "bold" }}
                    >
                        Upload Image
                    </Typography>
                    {imageFile && (
                        <Box
                            sx={{
                                width: "100%",
                                height: "200px",
                                borderRadius: 2,
                                overflow: "hidden",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                border: "1px solid",
                                borderColor: "divider",
                                mb: 2,
                            }}
                        >
                            <img
                                src={URL.createObjectURL(imageFile)}
                                alt="Preview"
                                style={{
                                    maxWidth: "100%",
                                    maxHeight: "100%",
                                    objectFit: "contain",
                                }}
                            />
                        </Box>
                    )}
                    <TextField
                        type="file"
                        inputProps={{ accept: "image/*" }}
                        onChange={handleFileChange}
                        fullWidth
                        sx={{
                            "& .MuiInputBase-root": {
                                borderRadius: 2,
                            },
                        }}
                    />
                    <TextField
                        label="Title"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        fullWidth
                        sx={{
                            "& .MuiInputBase-root": {
                                borderRadius: 2,
                            },
                        }}
                    />
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        sx={{
                            "& .MuiInputBase-root": {
                                borderRadius: 2,
                            },
                        }}
                    />
                    {uploadError && (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                p: 2,
                                borderRadius: 2,
                                bgcolor: "error.light",
                                color: "error.contrastText",
                                boxShadow: 1,
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    fontWeight: "bold",
                                }}
                            >
                                Error:
                            </Typography>
                            <Typography variant="body2">
                                {uploadError}
                            </Typography>
                        </Box>
                    )}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 2,
                        }}
                    >
                        <Button
                            onClick={handleCloseModal}
                            color="secondary"
                            variant="outlined"
                            disabled={uploading}
                            sx={{
                                borderRadius: 2,
                                textTransform: "none",
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            color="primary"
                            variant="contained"
                            disabled={uploading}
                            sx={{
                                borderRadius: 2,
                                textTransform: "none",
                            }}
                        >
                            {uploading ? (
                                <CircularProgress size={24} />
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}
