/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import CreateNewSite from "./CreateNewSite";
import Catalogue1 from "./Catalogue1";
import { Link } from "react-router-dom";
import {
	Grid,
	Card,
	CardContent,
	ButtonBase,
	Typography,
	Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function SearchResult({ query }) {
	const [open, setOpen] = useState(false);
	const [data, setData] = useState([]);

	const handleClick1 = () => {
		setOpen(true);
		console.log("Add card clicked!");
	};

	const handleClick2 = (id) => () => {
		// event handler
		console.log("Card clicked! ID:", id);
		Catalogue1.refreshPage(); // Tell the Catalogue1 to refresh
	};

	useEffect(() => {
		// Fetch data from JSON server on component mount
		fetch("http://localhost:3000/sites")
			.then((response) => response.json())
			.then((json) => setData(json))
			.catch((error) => console.error("Error fetching data:", error));
	}, [open]);

	//Filter data based on search query (mock)
	const filteredData = data?.filter((item) =>
		item.name.toLowerCase().includes(query.toLowerCase()),
	);

	return (
		<div>
			<Grid maxWidth="md" style={{ marginTop: 20, marginLeft: -10 }}>
				<Box display="flex">
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6} md={3}>
							<ButtonBase onClick={handleClick1}>
								<Card>
									<CardContent style={{ textAlign: "center" }}>
										<AddIcon style={{ fontSize: 80, color: "lightgrey" }} />
									</CardContent>
								</Card>
							</ButtonBase>
						</Grid>
						{filteredData &&
							filteredData.map((item, key) => (
								<Grid item xs={12} sm={6} md={3} key={item.id}>
									<ButtonBase onClick={handleClick2(item.id)}>
										{/* <Link to={"/addnewprojectile"} state={{key}}> */}

										<Link to="/addnewprojectile" state={{ some: item }}>
											<Card>
												<CardContent>
													<Typography variant="h5" component="h3">
														{item.name}
													</Typography>
													<Typography color="textSecondary" gutterBottom>
														{item.location}
													</Typography>
													<Typography variant="body2" component="p">
														{item.id}
													</Typography>
												</CardContent>
											</Card>
										</Link>
									</ButtonBase>
								</Grid>
							))}
					</Grid>
				</Box>
			</Grid>
			<Typography>{open && <CreateNewSite setOpen={setOpen} />}</Typography>
		</div>
	);
}
