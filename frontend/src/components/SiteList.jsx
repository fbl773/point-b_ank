/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import SiteModal from "./SiteModal";
import EditSite from "../refactor/EditSite.jsx";
import { Link } from "react-router-dom";
import {
	styled,
	Grid,
	Card,
	CardContent,
	ButtonBase,
	Typography,
	Box,
	Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { sortData } from "../sortUtils";
import http from "../../http.js";
import SiteCard from "../refactor/SiteCard.jsx";

/**
 * Item component styled from the Paper MUI component.
 * Intended for use in displaying individual site data as cards.
 */
const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: "center",
	color: theme.palette.text.secondary,
	minHeight: "700px !important",
}));

/**
 * SiteList functional component displays a list of sites.
 * Includes functionality to add a new site and view existing sites.
 *
 * @param {Object} props - The component props.
 * @param {string} props.query - The search query used to filter displayed sites.
 * @param {string} host_catalogue_id the id of the hosting catalogue
 * @pre None
 * @post Renders a list of site cards filtered by the provided query. Each card is clickable.
 * @returns {JSX.Element} The rendered component with a list of site cards.
 */
export default function SiteList({ query, sortValue, host_catalogue_id }) {
	const [openAdd, setOpenAdd] = useState(false); // Controls the visibility of the SiteModal.
	const [data, setData] = useState([]); // Stores the list of sites.
	const { user } = useContext(UserContext);
	/**
	 * Opens the SiteModal when the new site button is clicked.
	 *
	 * @pre None
	 * @post Sets the 'open' state to true, making the SiteModal visible.
	 */
	const handleClick1 = () => {
		setOpenAdd(true);
		console.log("Add card clicked!");
	};

	/**
	 * Logs the click action when an existing site card is clicked.
	 *
	 * @param {Object} item - The site data associated with the clicked card.
	 * @returns {Function} An event handler function for the click event.
	 * @pre None
	 * @post Logs the clicked site's ID to the console.
	 */
	const handleClick2 = (item) => () => {
		console.log("Card clicked! ID:", item.id);
	};

	function onClose(){
		setOpenAdd(false)
	}

	/**
	 * queries a sites region ID to get it's region details
	 * @param sites:[] the list of sites
	 * @return {Promise<void>}
	 */
	async function assign_location(site){
		http.get(`/regions/${site.region_id}`)
			.then(reg=> {
				site.location = reg.data.name;
			})
			.catch(err => console.error("Your Hacky BS is not working :(",err));
	}

	/**
	 * Fetches the list of sites from the backend upon component mount.
	 *
	 * @pre None
	 * @post Sets the 'data' state to the list of fetched sites. Catches and logs any errors.
	 */
	useEffect(() => {
		async function bad_design(){
			await http.get("/sites")
				.then((response) => response.data)
				.then((sites) => {
					// sort JSON first
					const sortedData = sortData(sites, sortValue);
					sites.forEach(site => assign_location(site));
					setData(sortedData);

				})
				.catch((error) => console.error("Error fetching data:", error));
		}
		bad_design();
	}, [openAdd, sortValue]); // Depend on 'open' to refetch when the modal is closed.

	/**
	 * Filters the fetched sites data based on the search query.
	 */
	const filteredData = data?.filter((item) =>
		item.name.toLowerCase().includes(query.toLowerCase()),
	);

	return (
		<div>
			<Item variant="outlined" sx={{ mb: "40px" }}>
				<Grid style={{ padding: 30 }}>
					<Box display="flex">
						<Grid container spacing={5}>
							{user && (
								<Grid item xs={12} sm={6} md={3}>
									<ButtonBase onClick={handleClick1}>
										<Card
											sx={{
												minWidth: "12rem",
												minHeight: "12rem",
												alignContent: "center",
											}}
										>
											<CardContent style={{ textAlign: "center" }}>
												<AddIcon style={{ fontSize: 80, color: "lightgrey" }} />
												<Typography variant="body2">Add Site</Typography>
											</CardContent>
										</Card>
									</ButtonBase>
								</Grid>
							)}
							{filteredData &&
								filteredData.map((item) =>
								<Grid item xl={2} key={item._id}>
									<Link to={`/site/${item._id}`} state={{info: item}}>
										<SiteCard site={item}/>
									</Link>
								</Grid>
								)}
						</Grid>
					</Box>
				</Grid>
			</Item>
			{/*{openAdd && <SiteModal adding_new={true} onClose={() => setOpenAdd(false)} catalogue_id={host_catalogue_id}/>}*/}
			{openAdd && <EditSite adding_new={true} onClose={onClose} catalogue_id={host_catalogue_id}/>}
		</div>
	);
}
