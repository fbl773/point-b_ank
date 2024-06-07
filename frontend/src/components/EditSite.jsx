import React, {Component} from "react";
import http from "../../http.js";
import {
	Button,
	Dialog, DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	Grid, IconButton, InputLabel, Menu, MenuItem, Select,
	TextField,
	Typography
} from "@mui/material";
import RegionListItem from "../refactor/RegionListItem.jsx";

class EditSite extends Component {

	/**
	 *
	 * @param props
	 * @param props.site {_id:String,name:_string, region_id:id of our region} the site we will represent
	 *
	 */
	constructor(props) {
		super(props);

		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
		this.handleLocationChange = this.handleLocationChange.bind(this);
		this.handleClose = this.handleClose.bind(this);

		this.state = {
			siteNameError:false,
			title:"",
			site: {
				_id:"",
				name:"",
				description:"",
				location:"",
				region_id:"",
				catalogue_id:this.props.catalogue_id,
			},
			region_name:"",
		};
	}


	async componentDidMount() {

		if (this.props.adding_new){
			this.handleSubmit = this.handleAddSite.bind(this);
			this.setState({title:"Create"});
		} else {
			this.handleSubmit = this.handleEditSite.bind(this);
			//editing existing
			this.setState({title:"Edit"});
			this.setState({site:this.props.site});

			//Get Region
			await http.get(`/regions/${this.state.site.region_id}`)
				.then(reg => {
					this.setState({region_name: reg.data.name});
				})
				.catch(err =>
					console.error(`Failed to retrieve details for site ${this.state.site._id}, region: ${this.state.site.region_id}`, err));
		}

	}

	update_site = (key,val) => {
		let updated_site = this.state.site;
		updated_site[key] = val;
		this.setState({site:updated_site});
	}
	handleDescriptionChange= (e) => this.update_site("description",e.target.value);

	handleNameChange = (e) => this.update_site("name",e.target.value);

	handleLocationChange = (e) => this.update_site("location",e.target.value);

	handleClose = (e) => this.props.onClose(false);

	handleAddSite = async () => {
		console.log("Would add site: ", this.state.site);
		// await http.post("/sites",this.state.site)
		// 	.then(new_site => this.setState({site:new_site}))
		// 	.catch(err => console.error("Failed to create new site",err));
	};

	handleEditSite = async () => {
		console.log("would edit site: ",this.state.site);
		// await http.put(`/sites/${this.state.site._id}`,this.state.site)
		// 	.then(edited_site => this.setState({site:edited_site}))
		// 	.catch(err => console.error("Failed to create new site",err));
	};

	render(){
		return(<div>
			<Dialog
				open={true}
				onClose={this.handleClose}
				maxWidth="sm"
				fullWidth
				PaperProps={{ style: { maxHeight: "80vh" } }}
			>
				{<DialogTitle>{this.state.title} {this.state.site.name}</DialogTitle>}
				<DialogContent style={{ minHeight: "300px" }}>
					<TextField
						autoFocus
						margin="dense"
						id="siteName"
						label="Site Name"
						fullWidth
						required
						error={this.state.siteNameError}
						helperText={this.state.siteNameError && "Please enter a Site Name"}
						value={this.state.site.name}
						onChange={this.handleNameChange}
					/>
					<TextField
						margin="dense"
						id="description"
						label="Site Description"
						fullWidth
						multiline
						rows={10}
						value={this.state.site.description}
						onChange={this.handleDescriptionChange}
					/>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<TextField
								margin="dense"
								id="location"
								label="Location"
								fullWidth
								value={this.state.site.location}
								onChange={this.handleLocationChange}
							/>
						</Grid>
						<Grid item>THIS IS WHERE REGION EDIT WOULD GO</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.handleClose} color="primary">
						Cancel
					</Button>
					 <Button onClick={this.handleSubmit} color="primary">
						 {this.props.adding_new ? "Add":"Save Changes"}
					 </Button>
				</DialogActions>
			</Dialog>
		</div>)
	}
}
export default EditSite;
