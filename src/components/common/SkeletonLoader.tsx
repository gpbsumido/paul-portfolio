import { Box, Skeleton } from "@mui/material";

interface SkeletonLoaderProps {
    width: object;
    minHeight: object;
    bgcolor: string;
    circularSize: number;
    textWidths: number[];
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    width,
    minHeight,
    bgcolor,
    circularSize,
    textWidths,
}) => {
    return (
        <Box
            sx={{
                width,
                minHeight,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
                bgcolor,
            }}
        >
            <Skeleton
                variant="circular"
                width={circularSize}
                height={circularSize}
                sx={{ bgcolor }}
            />
            {textWidths.map((textWidth, index) => (
                <Skeleton
                    key={index}
                    variant="text"
                    sx={{
                        width: `${textWidth}px`,
                        height: "40px",
                        bgcolor,
                    }}
                />
            ))}
        </Box>
    );
};
