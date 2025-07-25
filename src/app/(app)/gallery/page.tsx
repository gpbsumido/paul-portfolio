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
    IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState, useRef, useCallback } from "react";
import React from "react";
import _ from "lodash";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { HomeButton } from "@/components/common/HomeButton";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth0 } from "@auth0/auth0-react";
import FloatingPill from "@/components/shared/FloatingPill";
import ReusableModal from "@/components/common/ReusableModal";
import ErrorBoundary from "@/components/layout/ErrorBoundary";

interface ImageData {
    src: string;
    width: number;
    height: number;
    blurDataURL?: string;
    originalWidth: number;
    originalHeight: number;
    user_sub?: string;
}

export default function Gallery(): React.ReactElement | null {
    const { user, isAuthenticated, isLoading, getAccessTokenSilently } =
        useAuth0();

    const { t } = useLanguage();

    const theme = useTheme();

    const [images, setImages] = useState<ImageData[]>([]);
    const [containerWidth, setContainerWidth] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [text, setText] = useState("");
    const [description, setDescription] = useState("");
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
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<{
        id: string;
        src: string;
    } | null>(null);

    const preloadImage = (src: string): Promise<void> => {
        // Skip preloading for unsupported formats like .HEIC
        if (src.toLowerCase().endsWith(".heic")) {
            console.warn(`Skipping unsupported image format: ${src}`);
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const img = new Image();
            let isCancelled = false;

            const cleanup = () => {
                img.onload = null;
                img.onerror = null;
                img.src = "";
            };

            img.onload = () => {
                if (!isCancelled) {
                    cleanup();
                    resolve();
                }
            };

            img.onerror = () => {
                if (!isCancelled) {
                    cleanup();
                    reject(new Error(`Failed to preload image: ${src}`));
                }
            };

            img.src = src;

            // Return cleanup function for cancellation
            return () => {
                isCancelled = true;
                cleanup();
            };
        });
    };

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
            const loadingRef = useRef<HTMLImageElement | null>(null);
            const isMountedRef = useRef(true);

            useEffect(() => {
                isMountedRef.current = true;
                return () => {
                    isMountedRef.current = false;
                    // Cleanup loading image if component unmounts
                    if (loadingRef.current) {
                        loadingRef.current.onload = null;
                        loadingRef.current.onerror = null;
                        loadingRef.current.src = "";
                        loadingRef.current = null;
                    }
                };
            }, []);

            useEffect(() => {
                if (index < 3) return; // Skip intersection observer for first 3 images

                const observer = new IntersectionObserver(
                    ([entry]) => {
                        if (entry.isIntersecting && isMountedRef.current) {
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

                return () => {
                    observer.disconnect();
                };
            }, [index]);

            useEffect(() => {
                if (!isVisible || !isMountedRef.current) return;

                const load = async () => {
                    if (imageCache.current[image.src]?.loaded) {
                        if (isMountedRef.current) {
                            setIsLoaded(true);
                        }
                        return;
                    }

                    try {
                        const img = new Image();
                        loadingRef.current = img;

                        img.onload = () => {
                            if (isMountedRef.current) {
                                imageCache.current[image.src] = {
                                    element: img,
                                    loaded: true,
                                };
                                setIsLoaded(true);
                            }
                            loadingRef.current = null;
                        };

                        img.onerror = () => {
                            if (isMountedRef.current) {
                                console.error(
                                    "Error loading image:",
                                    image.src
                                );
                                delete imageCache.current[image.src];
                            }
                            loadingRef.current = null;
                        };

                        img.src = image.src;
                    } catch (error) {
                        if (isMountedRef.current) {
                            console.error("Error loading image:", error);
                        }
                        loadingRef.current = null;
                    }
                };

                load();

                // Cleanup function
                return () => {
                    if (loadingRef.current) {
                        loadingRef.current.onload = null;
                        loadingRef.current.onerror = null;
                        loadingRef.current.src = "";
                        loadingRef.current = null;
                    }
                };
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
            return () => {
                window.removeEventListener("resize", handleResize);
                clearTimeout(timeout);
            };
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

            // Create an AbortController for this request
            const abortController = new AbortController();

            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || ""}/api/gallery?page=${pageNumber}&limit=4`,
                    {
                        signal: abortController.signal,
                    }
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.error || "Failed to fetch images"
                    );
                }

                const data = await response.json();

                // Preload images for first page only, with proper cleanup
                if (pageNumber === 1) {
                    const preloadPromises = data
                        .filter(
                            (item: { imageUrl: string }) =>
                                !item.imageUrl.toLowerCase().endsWith(".heic")
                        )
                        .slice(0, 3) // Only preload first 3 images
                        .map(async (item: { imageUrl: string }) => {
                            try {
                                await preloadImage(item.imageUrl);
                            } catch (error) {
                                console.warn(
                                    `Failed to preload image: ${item.imageUrl}`,
                                    error
                                );
                            }
                        });

                    // Wait for preloading to complete, but don't block the main flow
                    Promise.all(preloadPromises).catch((error) => {
                        console.warn("Some images failed to preload:", error);
                    });
                }

                const formattedImages = data
                    .filter(
                        (item: { imageUrl: string }) =>
                            !item.imageUrl.toLowerCase().endsWith(".heic")
                    )
                    .map(
                        (item: {
                            key: string;
                            imageUrl: string;
                            blurDataURL?: string;
                            user_sub?: string;
                        }) => ({
                            src: item.imageUrl,
                            width: 0,
                            height: 0,
                            originalWidth: 0,
                            originalHeight: 0,
                            blurDataURL: item.blurDataURL,
                            user_sub: item.user_sub,
                        })
                    );

                setImages((prev) => {
                    const existingUrls = new Set(prev.map((img) => img.src));
                    const uniqueImages = formattedImages.filter(
                        (img: any) => !existingUrls.has(img.src)
                    );
                    return [...prev, ...uniqueImages];
                });
                setFetchedImages((prev) => [...prev, ...data]);
                setHasMore(formattedImages.length === 4);
                lastFetchedPage.current = pageNumber;
            } catch (error: any) {
                // Don't set error if the request was aborted
                if (error.name !== "AbortError") {
                    setFetchError(
                        error.message ||
                            "An unexpected error occurred while fetching posts."
                    );
                }
            } finally {
                setIsFetching(false);
            }

            // Return abort function for cleanup
            return () => {
                abortController.abort();
            };
        },
        [isFetching, fetchError]
    );

    useEffect(() => {
        let abortFunction: (() => void) | undefined;

        const loadImages = async () => {
            abortFunction = await fetchImages(page);
        };

        loadImages();

        // Cleanup function
        return () => {
            if (abortFunction) {
                abortFunction();
            }
        };
    }, [page, fetchImages]);

    useEffect(() => {
        if (!containerRef.current) return;

        const options = {
            root: null,
            rootMargin: "100px",
            threshold: 0.1,
        };

        // Clean up any existing observer before creating a new one
        if (observer.current) {
            observer.current.disconnect();
            observer.current = null;
        }

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasMore && !isFetching) {
                setPage((prev) => prev + 1);
            }
        }, options);

        observer.current.observe(containerRef.current);

        return () => {
            if (observer.current) {
                observer.current.disconnect();
                observer.current = null;
            }
        };
    }, [hasMore, isFetching]);

    // Additional cleanup effect for component unmount
    useEffect(() => {
        return () => {
            // Cleanup intersection observer
            if (observer.current) {
                observer.current.disconnect();
                observer.current = null;
            }

            // Clear image cache to free memory
            Object.values(imageCache.current).forEach((cacheEntry) => {
                if (cacheEntry.element) {
                    cacheEntry.element.onload = null;
                    cacheEntry.element.onerror = null;
                    cacheEntry.element.src = "";
                }
            });
            imageCache.current = {};

            // Reset refs
            lastFetchedPage.current = 0;

            // Clear any pending state updates
            setIsFetching(false);
            setFetchError(null);
            setUploading(false);
            setUploadError(null);
            setDeleteError(null);
        };
    }, []);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        // Reset all form states
        setText("");
        setDescription("");
        setImageFile(null);
        setUploading(false);
        setUploadError(null);
        // Close modal last
        setIsModalOpen(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleUnselectFile = () => {
        setImageFile(null);
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

        // Create an AbortController for this request
        const abortController = new AbortController();

        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
                },
            });
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/gallery`,
                {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    signal: abortController.signal,
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
            // Don't set error if the request was aborted
            if (err.name !== "AbortError") {
                if (err.message.includes("Missing Refresh Token")) {
                    setUploadError(
                        "Authentication error: Missing refresh token. Please login to resolve the issue. If already logged in, try logging out and then logging back in."
                    );
                } else {
                    setUploadError(
                        err.message || "An unexpected error occurred"
                    );
                }
            }
        } finally {
            setUploading(false);
        }

        // Return abort function for cleanup
        return () => {
            abortController.abort();
        };
    };

    const handleOpenDeleteModal = (imageId: string, imageUrl: string) => {
        setImageToDelete({ id: imageId, src: imageUrl });
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setImageToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const handleConfirmDelete = async () => {
        if (!imageToDelete) return;

        const { id, src } = imageToDelete;
        setDeletingImageId(id);
        setDeleteError(null);

        // Create an AbortController for this request
        const abortController = new AbortController();

        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience: process.env.NEXT_PUBLIC_AUTH0_AUDIENCE,
                },
            });

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/gallery/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    signal: abortController.signal,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to delete image");
            }

            setImages((prev) => prev.filter((img) => img.src !== src));
            setFetchedImages((prev) => prev.filter((img) => img.id !== id));
            delete imageCache.current[src];
        } catch (error: any) {
            // Don't set error if the request was aborted
            if (error.name !== "AbortError") {
                setDeleteError(
                    error.message ||
                        "An unexpected error occurred while deleting the post."
                );
            }
        } finally {
            setDeletingImageId(null);
            handleCloseDeleteModal();
        }

        // Return abort function for cleanup
        return () => {
            abortController.abort();
        };
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, py: 4 }}>
            <FloatingPill hide={isModalOpen || isDeleteModalOpen} />

            <Box
                sx={{
                    position: "fixed",
                    top: { xs: "8px", sm: "16px" },
                    left: { xs: "8px", sm: "16px" },
                    zIndex: 9999,
                }}
            >
                <HomeButton component={Link} href="/" />
            </Box>
            <Box
                sx={{
                    position: "fixed",
                    top: { xs: "8px", sm: "16px" },
                    right: { xs: "8px", sm: "16px" },
                    zIndex: 9999,
                }}
            >
                <LanguageSwitcher />
            </Box>

            <ErrorBoundary>
                <Box
                    sx={{
                        mb: 5,
                        textAlign: "center",
                        background: (theme) =>
                            `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{ fontWeight: 700 }}
                    >
                        {t("pages.gallery.title")}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{ color: "text.secondary" }}
                    >
                        {t("pages.gallery.subtitle")}
                    </Typography>
                </Box>
                {!images.length && !isLoading && !isFetching && (
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
                                        {isAuthenticated &&
                                            !isLoading &&
                                            image.user_sub === user?.sub && (
                                                <IconButton
                                                    className="delete-button"
                                                    onClick={() =>
                                                        handleOpenDeleteModal(
                                                            imageData.id,
                                                            image.src
                                                        )
                                                    } // Ensure correct ID and URL are passed
                                                    disabled={
                                                        deletingImageId ===
                                                        imageData?.id
                                                    }
                                                    sx={{
                                                        position: "absolute",
                                                        top: 8,
                                                        right: 8,
                                                        backgroundColor:
                                                            "rgba(0, 0, 0, 0.5)",
                                                        color: "white",
                                                        opacity: 0,
                                                        transition:
                                                            "opacity 0.2s ease",
                                                        zIndex: 3,
                                                        "&:hover": {
                                                            backgroundColor:
                                                                "rgba(0, 0, 0, 0.7)",
                                                        },
                                                    }}
                                                >
                                                    {deletingImageId ===
                                                    imageData?.id ? (
                                                        <CircularProgress
                                                            size={24}
                                                            color="inherit"
                                                        />
                                                    ) : (
                                                        <DeleteIcon />
                                                    )}
                                                </IconButton>
                                            )}
                                        {deleteError &&
                                            deletingImageId ===
                                                imageData?.id && (
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
                                                    background:
                                                        "linear-gradient(transparent, rgba(0, 0, 0, 0.8))",
                                                    color: "white",
                                                    padding: 2,
                                                    opacity: 0,
                                                    transition:
                                                        "opacity 0.2s ease",
                                                }}
                                            >
                                                {imageData.text && (
                                                    <Typography
                                                        variant="body2"
                                                        sx={{ mb: 1 }}
                                                    >
                                                        {imageData.text}
                                                    </Typography>
                                                )}
                                                {imageData.description && (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            display: "block",
                                                            mb: 1,
                                                            opacity: 0.8,
                                                        }}
                                                    >
                                                        {imageData.description}
                                                    </Typography>
                                                )}
                                                {imageData.date && (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            opacity: 0.6,
                                                            fontSize: "0.75rem",
                                                        }}
                                                    >
                                                        {new Date(
                                                            imageData.date
                                                        ).toLocaleDateString()}
                                                    </Typography>
                                                )}
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </Container>

                {isFetching && (
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

                {/* Floating Action Button */}
                <Fab
                    color="primary"
                    aria-label="add"
                    onClick={handleOpenModal}
                    sx={{
                        position: "fixed",
                        bottom: { xs: "16px", sm: "32px" },
                        right: { xs: "16px", sm: "32px" },
                        display: isModalOpen ? "none" : "flex",
                    }}
                >
                    <AddIcon />
                </Fab>

                {/* Upload Modal */}
                <ReusableModal
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    title="Upload Image"
                    confirmColor="primary"
                    onConfirm={handleSubmit}
                    confirmText="Upload"
                    cancelText="Cancel"
                    cancelColor="secondary"
                    titleColor="primary.main"
                    isConfirmDisabled={!imageFile || uploading || !text.trim()}
                    children={
                        <Box sx={{ p: 2 }}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                sx={{ mb: 2 }}
                                required
                            />
                            <TextField
                                fullWidth
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                multiline
                                rows={3}
                                sx={{ mb: 2 }}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ marginBottom: "16px" }}
                            />
                            {imageFile && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="body2">
                                        Selected: {imageFile.name}
                                    </Typography>
                                    <Button
                                        size="small"
                                        onClick={handleUnselectFile}
                                        sx={{ mt: 1 }}
                                    >
                                        Remove
                                    </Button>
                                </Box>
                            )}
                            {uploadError && (
                                <Typography
                                    variant="body2"
                                    color="error"
                                    sx={{ mt: 2 }}
                                >
                                    {uploadError}
                                </Typography>
                            )}
                        </Box>
                    }
                />

                {/* Delete Confirmation Modal */}
                <ReusableModal
                    open={isDeleteModalOpen}
                    onClose={handleCloseDeleteModal}
                    title="Delete Image"
                    confirmColor="error"
                    onConfirm={handleConfirmDelete}
                    confirmText="Delete"
                    cancelText="Cancel"
                    cancelColor="secondary"
                    titleColor="error.main"
                    isConfirmDisabled={deletingImageId !== null}
                    children={
                        <Box sx={{ p: 2 }}>
                            <Typography>
                                Are you sure you want to delete this image? This
                                action cannot be undone.
                            </Typography>
                        </Box>
                    }
                />
            </ErrorBoundary>
        </Container>
    );
}
