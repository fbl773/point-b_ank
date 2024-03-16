// eslint-disable-next-line no-unused-vars
import React, { useContext } from "react";

// MUI
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

// Imported Components
import Sidebar from "./Sidebar";
import { UserContext } from "../context/userContext";

// create Item component and styling, based on Paper MUI component
const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: "center",
	color: theme.palette.text.secondary,
}));

function Home() {
	const { user } = useContext(UserContext);
	// console.log(user)

	return (
		<>
			<Box sx={{ display: "flex" }}>
				<CssBaseline />
				<Sidebar />
				<Box
					sx={{
						flexGrow: 1,
						padding: "30px",
					}}
				>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Typography color="text.primary">
								Breadcrumbs / Navigation / Component / Placeholder
							</Typography>

							<div>
								{user && user.userName ? (
									<h1>Hello admin sir!</h1>
								) : (
									<h1>basic user</h1>
								)}
							</div>
						</Grid>
						<Grid item xs={12}>
							<TextField
								id="standard-basic"
								sx={{ minWidth: 500 }}
								label="Search"
								variant="standard"
							/>
						</Grid>
						<Grid item xs={12}>
							<Divider />
						</Grid>
						<Grid item xs={12}>
							<FormControl variant="standard" sx={{ minWidth: 200 }}>
								<InputLabel id="demo-simple-select-standard-label">
									Sort
								</InputLabel>
								<Select
									labelId="demo-simple-select-standard-label"
									id="demo-simple-select-standard"
									label="Sort"
								>
									<MenuItem value="">
										<em>None</em>
									</MenuItem>
									<MenuItem value={1}>Name</MenuItem>
									<MenuItem value={2}>Type</MenuItem>
								</Select>
							</FormControl>
							<FormControl
								variant="standard"
								sx={{ ml: "20px", minWidth: 200 }}
							>
								<InputLabel id="demo-simple-select-standard-label">
									Filter
								</InputLabel>
								<Select
									labelId="demo-simple-select-standard-label"
									id="demo-simple-select-standard"
									label="Filter"
								>
									<MenuItem value="">
										<em>None</em>
									</MenuItem>
									<MenuItem value={1}>Name</MenuItem>
									<MenuItem value={2}>Description</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<Item
								variant="outlined"
								sx={{ mt: "40px", minHeight: "500px" }}
							></Item>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</>
	);
}

export default Home;