import { Box } from "@mui/material";
import Header from "./components/Header";
import Table from "./components/Table";

export default function Index() {
    return (
        <Box sx={{ p: 1.5 }}>
            <Header />
            <Table />
        </Box>
    );
}