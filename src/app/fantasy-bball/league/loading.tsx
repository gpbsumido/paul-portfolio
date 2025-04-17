import { Skeleton } from "@mui/material";

export default function LeagueLoading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <Skeleton variant="text" width={200} height={40} className="mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md p-6"
                    >
                        <Skeleton
                            variant="text"
                            width={150}
                            height={30}
                            className="mb-2"
                        />
                        <Skeleton
                            variant="text"
                            width={120}
                            height={24}
                            className="mb-4"
                        />
                        <Skeleton
                            variant="text"
                            width={100}
                            height={20}
                            className="mb-4"
                        />
                        <div>
                            <Skeleton
                                variant="text"
                                width={80}
                                height={24}
                                className="mb-2"
                            />
                            {[...Array(5)].map((_, i) => (
                                <Skeleton
                                    key={i}
                                    variant="text"
                                    width="100%"
                                    height={20}
                                    className="mb-1"
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
