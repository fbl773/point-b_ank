import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import FileUpload from "./UploadPicture";
import { Link, useLocation } from "react-router-dom";
import Site from "./Site";
import logger from "../logger.js";
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	MenuItem,
	Grid,
	FormControl,
	IconButton,
	Menu,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// import { EditIcon, DeleteIcon, MoreHorizIcon } from "@mui/icons-material";
import log from "../logger.js";

import PeriodModal from "./PeriodModal.jsx"; // Rename as required

// eslint-disable-next-line no-unused-vars
const AddProjectile = ({ setOpen }) => {
	const inComingSiteInfo = useLocation();

	const [siteID, setSiteID] = useState(inComingSiteInfo.state.info.id);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("");
	const [dimensions, setDimensions] = useState("");
	const [photoFilePath, setPhotoFilePath] = useState("");
	const [subtype, setSubtype] = useState("");
	const [artifactType, setArtifactType] = useState(1);
	// const [cultureID, setCultureID] = useState(1);
	// const [bladeShapeID, setBladeShapeID] = useState(1);
	// const [baseShapeID, setBaseShapeID] = useState(1);
	// const [haftingShapeID, setHaftingShapeID] = useState(1);
	// const [crossSectionID, setCrossSectionID] = useState(1);

	// ------- For state variables for managing period dropdown and edit/delete functionalities -------
	const [anchorEl, setAnchorEl] = useState(null); // For the dropdown menu anchor
	const [currentPeriod, setCurrentPeriod] = useState(null); // The period currently selected in the dropdown

	// Function to open the dropdown menu (Edit/Delete options for periods)
	const handleOpenMenu = (event, period) => {
		setAnchorEl(event.currentTarget);
		setCurrentPeriod(period);
	};

	// Function to close the dropdown menu
	const handleCloseMenu = () => {
		setAnchorEl(null);
		setCurrentPeriod(null);
	};

	// ----------------------------------------------------------------------------------------

	// ------------ For state variables for editing periods through the PeriodModal ------------
	const [periods, setPeriods] = useState([]);
	const [selectedPeriod, setSelectedPeriod] = useState("");
	const [editPeriod, setEditPeriod] = useState(false);
	const [periodModalOpen, setPeriodModalOpen] = useState(false);
	const [selectedPeriodID, setSelectedPeriodID] = useState(null);
	// -----------------------------------------------------------------------------------------

	const [currentProjectiles, setCurrentProjectiles] = useState([]);

	// const PlaceholderText = "Add Information";
	const handleClose = () => {
		setOpen(false);
		// window.location.reload();
	};

	const handleNameChange = (event) => {
		setName(event.target.value);
	};

	const handleLocationChange = (event) => {
		setLocation(event.target.value);
	};

	const handleDescriptionChange = (event) => {
		setDescription(event.target.value);
	};

	const handleDimensionsChange = (event) => {
		setDimensions(event.target.value);
	};

	const handlePhotoFilePathChange = (event) => {
		setPhotoFilePath(event.target.value);
	};

	const handleSubtypeChange = (event) => {
		setSubtype(event.target.value);
	};

	const handleSubmit = () => {
		logger.info("Adding new projectile");

		const newProjectilePoint = {
			name,
			location,
			description,
			dimensions,
			photo: photoFilePath,
			siteId: siteID,
			artifactTypeId: artifactType,
			subtype,
			// cultureId,
			// bladeShapdeId,
			// baseShapeId,
			// haftingShapeId,
			// crossSectionId,
		};

		logger.debug(newProjectilePoint);

		axios
			.post("http://localhost:3000/projectilePoints", newProjectilePoint)
			.then((response) => {
				console.log("New projectile point added successfully:", response.data);
			})
			.catch((error) => {
				console.error("Error adding new  projectile point:", error);
			});
		setOpen(true);
		console.log("Submitted:", newProjectilePoint);
		handleClose();
	};

	// const handleClick = () => {
	// 	fetch("http://localhost:3000/sites")
	// 		.then((response) => response.json())
	// 		.then((json) => setCurrentProjectiles(json))
	// 		.catch((error) => console.error("Error fetching data:", error));
	// };

	// useEffect(() => {
	// 	handleClick();
	// }, [handleClick]);

	// useEffect(() => {
	// 	console.log(name);
	// 	console.log(location);
	// 	console.log(dimensions);
	// 	console.log(artifactType);
	// 	//setSiteID(some.id);
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [dimensions, name, location, artifactType]);

	// ------------ For EDIT Period Modal ------------
	// Load periods from the database on component mount
	useEffect(() => {
		axios
			.get("http://localhost:3000/periods")
			.then((response) => {
				setPeriods(response.data);
			})
			.catch((error) => {
				console.error("Error fetching periods:", error);
			});
	}, []);

	// Function to update the list of periods after an edit or addition
	const updatePeriodsList = (newPeriod) => {
		setPeriods((prevPeriods) => {
			// Check if the period already exists and update it
			const index = prevPeriods.findIndex(
				(period) => period.id === newPeriod.id,
			);
			if (index > -1) {
				// Update existing period
				const updatedPeriods = [...prevPeriods];
				updatedPeriods[index] = newPeriod;
				return updatedPeriods;
			} else {
				// Else, add the new period to the list
				return [...prevPeriods, newPeriod];
			}
		});
	};

	// Function to delete a period
	const handleDeletePeriod = () => {
		if (currentPeriod && currentPeriod.id) {
			axios
				.delete(`http://localhost:3000/periods/${currentPeriod.id}`)
				.then(() => {
					setPeriods(periods.filter((p) => p.id !== currentPeriod.id));
					handleCloseMenu();
				})
				.catch((error) => {
					console.error("Error deleting period:", error);
				});
		}
	};
	// ------------------------------------------------

	const handlePeriodChange = (event) => {
		setSelectedPeriod(event.target.value);
	};

	const handleOpenPeriodModal = (periodId = null) => {
		setSelectedPeriodID(periodId);
		setEditPeriod(true);
		setPeriodModalOpen(true);
	};

	return (
		<div>
			<Dialog
				open={true}
				onClose={handleClose}
				maxWidth="md" //
				fullWidth
				PaperProps={{ style: { maxHeight: "80vh" } }}
			>
				<DialogTitle>
					Add Projectile to site {inComingSiteInfo.state.info.name}
				</DialogTitle>
				<DialogContent style={{ minHeight: "300px" }}>
					<Grid container spacing={2} sx={{ paddingTop: 0 }}>
						<Grid item xs={6}>
							<TextField
								margin="dense"
								id="name"
								label="Name"
								fullWidth
								value={name}
								onChange={handleNameChange}
							/>
							<TextField
								margin="dense"
								id="description"
								label="Description"
								multiline
								rows={10}
								fullWidth
								value={description}
								onChange={handleDescriptionChange}
							/>
							{/* ------------ EDIT REGION ------------- */}
							<TextField
								select
								label="Period"
								value={selectedPeriod}
								onChange={handlePeriodChange}
								fullWidth
								margin="dense"
							>
								{periods.map((period) => (
									<MenuItem
										key={period.id}
										value={period.name}
										onClick={(event) => handleOpenMenu(event, period)}
									>
										{period.name}
									</MenuItem>
								))}
								<MenuItem onClick={() => handleOpenPeriodModal()}>
									+ Add New Period
								</MenuItem>
							</TextField>
							<Menu
								id="simple-menu"
								anchorEl={anchorEl}
								keepMounted
								open={Boolean(anchorEl)}
								onClose={handleCloseMenu}
							>
								<MenuItem
									onClick={() => {
										handleOpenPeriodModal(currentPeriod.id);
										handleCloseMenu();
									}}
								>
									<EditIcon fontSize="small" /> Edit
								</MenuItem>
								<MenuItem onClick={handleDeletePeriod}>
									<DeleteIcon fontSize="small" /> Delete
								</MenuItem>
							</Menu>

							{/* ------------ EDIT REGION ------------- */}
						</Grid>
						<Grid item xs={6}>
							{/*This should removed, as the location is attached to the site*/}
							<TextField
								margin="dense"
								id="location"
								label="Location"
								fullWidth
								value={location}
								onChange={handleLocationChange}
							/>
							{/* The dimensions should be three different fields(length, width, height and )
						if you are making this change, make sure the database was changed to hold a list of
						float/double and not a string*/}
							<TextField
								margin="dense"
								id="dimensions"
								label="Dimensions"
								fullWidth
								value={dimensions}
								onChange={handleDimensionsChange}
							/>
							{/* <FileUpload margin="dense" /> */}
							<TextField
								margin="dense"
								id="photoFilePath"
								label="Photo File Path"
								fullWidth
								value={photoFilePath}
								onChange={handlePhotoFilePathChange}
							/>
							<TextField
								margin="dense"
								id="subtype"
								label="Subtype"
								fullWidth
								value={subtype}
								onChange={handleSubtypeChange}
							/>
							{/*Should be renamed(maybe just drop the ID?)  also, Menu items will need to be dynamic at some point*/}
							<TextField
								margin="dense"
								id="artifactTypeID"
								label="ArtifactTypeID"
								variant="outlined"
								fullWidth
								select
								value={artifactType}
								onChange={(e) => setArtifactType(e.target.value)}
							>
								<MenuItem value="1">Lithic</MenuItem>
								<MenuItem value="2">Ceramic</MenuItem>
								<MenuItem value="3">Faunal</MenuItem>
								<MenuItem value="4">Hello</MenuItem>
								<MenuItem value="5">Hi</MenuItem>
							</TextField>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleSubmit} color="primary">
						Add
					</Button>
				</DialogActions>
			</Dialog>
			{editPeriod && (
				<PeriodModal
					setEditPeriod={setEditPeriod}
					selectedPeriod={selectedPeriod}
					selectedPeriodID={selectedPeriodID}
					periods={periods}
					setPeriods={setPeriods}
					updatePeriodsList={updatePeriodsList}
					periodModalOpen={periodModalOpen}
					setPeriodModalOpen={setPeriodModalOpen}
				/>
			)}
		</div>
	);
};

export default AddProjectile;
