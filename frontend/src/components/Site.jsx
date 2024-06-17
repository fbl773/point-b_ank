/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState, useContext } from "react";
import ProjectileList from "./ProjectileList";
import BaseLayout from "./BaseLayout";
import http from "../../http.js";
import SearchIcon from "@mui/icons-material/Search";
import log from "../logger.js";
import {
	Button,
	TextField,
	IconButton,
	Typography,
	Grid,
	MenuItem,
} from "@mui/material";

import { UserContext } from "../context/userContext.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import EditSite from "../refactor/EditSite.jsx";
import DeleteConfirmDialog from "../refactor/DeleteConfirmDialog.jsx"

/**
 * Site component displays detailed information about a site and allows searching, sorting,
 * and filtering of related data entries (projectiles).
 *
 * @pre The component expects site information to be passed via the URL's state (from React Router).
 * @post Renders site information, a search bar, sorting, and filtering widgets.
 * @returns {JSX.Element} The rendered component with site details and interactive elements.
 */
const Site = () => {
	const [siteName, setSiteName] = useState("");
	const [siteDescription, setSiteDescription] = useState("");
	const [regionId, setRegionId] = useState("...loading");
	const [catalogueId,setCatalogueId] = useState("");
	const [location,setLocation] = useState("");

	const [searchValue, setSearchValue] = useState("");
	const [sortValue, setSortValue] = useState("newest");
	const [filterValue, setFilterValue] = useState("");

	const [openAlertDelete, setOpenAlertDelete] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);

	const { user } = useContext(UserContext);

	const inComingInfo = useLocation();
	const siteID = inComingInfo.state.info._id;


	/**
	 * Fetches detailed information about the site using its ID.
	 *
	 * @pre Axios must be configured correctly and siteID should be valid.
	 * @post Updates state with the fetched site name and description.
	 */
	useEffect(() => {
		async function fetchSite() {
			try {
				const response = await http.get(`/sites/${siteID}`);
				setSiteName(response.data.name);
				setSiteDescription(response.data.description);
				setRegionId(response.data.region_id);
				setCatalogueId(response.data.catalogue_id);
				setLocation(response.data.location);
			} catch (error) {
				log.error("Error fetching site:", error);
			}
		}

		fetchSite();
	}, [siteID, openEdit]);

	/**
	 * Updates the search value based on user input.
	 *
	 * @param {Event} event - The change event from the search input field.
	 * @pre None
	 * @post Updates the searchValue state with the new input.
	 */
	const handleSearch = (event) => {
		setSearchValue(event.target.value);
	};

	/**
	 * Updates the sort value based on user selection.
	 *
	 * @param {Event} event - The change event from the sort selection field.
	 * @pre None
	 * @post Updates the sortValue state with the new selection.
	 */
	const handleSortChange = (event) => {
		setSortValue(event.target.value);
	};

	/**
	 * Updates the filter value based on user selection.
	 *
	 * @param {Event} event - The change event from the filter selection field.
	 * @pre None
	 * @post Updates the filterValue state with the new selection.
	 */
	const handleFilterChange = (event) => {
		setFilterValue(event.target.value);
	};

	/**
	 * Set delete site alert modal visibility to true
	 * for confirming deletion of site
	 */
	const handleOpenAlertDelete = () => {
		setOpenAlertDelete(true);
	};

	/**
	 * Set delete site alert modal visibility to false
	 */
	const handleCloseAlertDelete = () => {
		setOpenAlertDelete(false);
	};

	/**
	 * Set edit projectile point modal visibility to true
	 */
	const handleEdit = () => {
		setOpenEdit(true);
	};

	/**
	 *
	 * @return {SiteEntity} this as a site
	 */
	const as_site = () => {
		return {
			_id: siteID,
			name: siteName,
			description: siteDescription,
			location: location,
			region_id: regionId,
			catalogueId: catalogueId
		}
	}

	const navigate = useNavigate();
	/**
	 * Handles deletion of site on click event
	 */
	const handleDelete = () => {
		http
			.delete(`sites/${siteID}`)
			.then(() => {
				log.info("Successfully deleted site");
				handleCloseAlertDelete();
				navigate("/");
			})
			.catch((error) => {
				log.error("Error deleting site:", error);
				handleCloseAlertDelete();
			});
	};

	return (
		<BaseLayout>
			<Grid item xs={12}>
				<Grid sx={{ marginBottom: 4 }}>
					<Typography variant="h4">{siteName}</Typography>

					<Typography
						sx={{ marginBottom: 0, fontWeight: "regular" }}
						variant="h6"
					>
						{siteDescription}
					</Typography>
					<Typography>
						{location}, {"REGION WOULD GO HERE (todo in refactor)"}
					</Typography>
					{user && (
						<Button
							sx={{ paddingLeft: 0, minWidth: 0, justifyContent: "flex-start" }}
							onClick={handleEdit}
							color="primary"
						>
							Edit
						</Button>
					)}
					{user && (
						<Button
							sx={{ justifyContent: "flex-start" }}
							onClick={handleOpenAlertDelete}
							color="primary"
						>
							Delete
						</Button>
					)}
				</Grid>
				{/* Search and filter UI */}
				<Grid container>
					<Grid item>
						<form noValidate autoComplete="off">
							<TextField
								sx={{ marginBottom: 4, minWidth: "300px" }}
								id="search"
								label="Search"
								variant="standard"
								fullWidth
								value={searchValue}
								onChange={handleSearch}
								InputProps={{
									startAdornment: (
										<IconButton type="submit" aria-label="search">
											<SearchIcon />
										</IconButton>
									),
								}}
							/>
						</form>
					</Grid>
				</Grid>
				<Grid container spacing={2} sx={{ marginBottom: 4 }}>
					<Grid item>
						<TextField
							id="sort"
							select
							label="Sort"
							variant="filled"
							fullWidth
							value={sortValue}
							onChange={handleSortChange}
							size="small"
							sx={{ minWidth: "250px" }}
						>
							<MenuItem value="newest">Newest</MenuItem>
							<MenuItem value="oldest">Oldest</MenuItem>
							<MenuItem value="numeric_ascending">
								Numerically Ascending
							</MenuItem>
							<MenuItem value="numeric_descending">
								Numerically Descending
							</MenuItem>
						</TextField>
					</Grid>
				</Grid>
			</Grid>
			{openEdit && (
				<EditSite adding_new={false}
						  onClose={() => setOpenEdit(false)}
						  site={as_site()}
						  catalogue_id={catalogueId}/>
			)}
			<Grid item xs={12}>
				<Typography variant="body1" sx={{ fontWeight: "medium" }}>
					Projectile Points
				</Typography>
				<ProjectileList
					query={searchValue}
					siteId={siteID}
					siteName={siteName}
					sortValue={sortValue}
				/>
			</Grid>
			<div>
				<DeleteConfirmDialog
					open_condition={openAlertDelete}
					title={`Delete Site "${siteName}"`}
					text={`Are you sure you want to delete "${siteName}"? This will also delete any related artifacts.`}
					on_cancel={handleCloseAlertDelete}
					on_proceed={handleDelete}/>
			</div>
		</BaseLayout>
	);
};

export default Site;
