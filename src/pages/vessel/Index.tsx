import { Box } from "@mui/material";
import Header from "./components/Header";
import Table from "./components/Table";
import Filter from "./components/Filter";

export default function Index() {
    return (
        <Box sx={{ p: 1.5 }}>
            <Header />
            <Filter />
            <Table />
        </Box>
    );
}