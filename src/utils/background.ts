export const getShapeProps = (index: number) => {
    switch (index) {
        case 0:
            return {
                clipPath: "polygon(100% 0, 85% 100%, 15% 100%, 0 0)",
                left: "5%",
                right: "auto",
                width: "35%",
            };
        case 1:
            return {
                clipPath: "polygon(95% 0, 100% 100%, 5% 100%, 0 0)",
                left: "0",
                right: "auto",
                width: "50%",
            };
        case 2:
            return {
                clipPath: "polygon(80% 0, 100% 100%, 20% 100%, 0 0)",
                left: "auto",
                right: "0",
                width: "50%",
            };
        case 3:
            return {
                clipPath: "polygon(100% 0, 100% 100%, 20% 100%, 0 0)",
                left: "auto",
                right: "auto",
                width: "60%",
            };
        case 4:
            return {
                clipPath: "polygon(100% 0, 90% 100%, 10% 100%, 0 0)",
                left: "10%",
                right: "auto",
                width: "50%",
            };
        case 5:
            return {
                clipPath: "polygon(100% 0, 100% 100%, 0 100%, 0 0)",
                left: "auto",
                right: "5%",
                width: "50%",
            };
        default:
            return {
                clipPath: "none",
                left: "auto",
                right: "auto",
                width: "50%",
            };
    }
};
