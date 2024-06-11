import React, {Component} from "react";
import http from "../../http.js";
import {
	Button,
	Dialog, DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	TextField,
} from "@mui/material";
import RegionList from "./RegionList.jsx";

/**
 * Replaces the SiteModal, handles editing and creating sites
 */
class EditSite extends Component {

	/**
	 *
	 * @param props
	 * @param props.onClose:Function this is what to do to close
	 * @param props.adding_new:boolean Are we adding a new site? or editing existing?
	 * @param props.siteNameError:String todo - figure out what this even is.
	 * @param props.catalogue_id:String the id of the catalouge we represent, (needed for adding new... todo-could this be the descriminator?"
	 * @param props.site {_id:String,name:_string, region_id:id of our region} the site we will represent
	 *
	 */
	constructor(props) {
		super(props);

		this.state = {
			siteNameError:false,
			title:"",
			site: {
				_id:"",
				name:"",
				description:"",
				location:"",
				catalogue_id:this.props.catalogue_id,
			},
			region_name:"",
		};
	}


	/**
	 * After loading, go get our region details from the server or prepare to add new details (depending on flag)
	 *
	 * @return {Promise<void>}
	 */
	async componentDidMount() {

		//If adding new, submit means we are creating, and we have no data to fetch
		if (this.props.adding_new){
			this.handleSubmit = this.handleAddSite.bind(this);
			this.setState({title:"Create"});
		} else {
			//otherwise, submit means we are editing, and we have a region to fetch
			this.handleSubmit = this.handleEditSite.bind(this);
			//editing existing
			this.setState({title: "Edit"});
			this.setState({site: this.props.site});

			//Get Region
			if (this.state.site.region_id !== undefined) {
				await http.get(`/regions/${this.state.site.region_id}`)
					.then(reg => {
						this.setState({region_name: reg.data.name});
					})
					.catch(err =>
						console.error(`Failed to retrieve details for site ${this.state.site._id}, region: ${this.state.site.region_id}`, err));
			}
		}

	}

	/**
	 * sets the state for our site sub-object
	 * @param key:String the key to the field of our site to update
	 * @param val:any the value to set it to
	 */
	update_site = (key,val) => {
		let updated_site = this.state.site;
		updated_site[key] = val;
		this.setState({site:updated_site});
	}

	/**
	 * Handles the case when the modals operation is to add the created site.i
	 * @return {Promise<void>}
	 */
	handleAddSite = async () => {

		//Capture the site
		let mod_site = this.state.site;

		//remove the _id field to appease mongo
		delete mod_site._id

		//Make the call to create the new site
		await http.post("/sites",mod_site)
			.then(new_site => this.setState({site:new_site}))
			.catch(err => console.error("Failed to create new site",err))
			.finally(this.props.onClose);
	};

	/**
	 * Handels the case when the operation is to edit an existing site
	 * @return {Promise<void>}
	 */
	handleEditSite = async () => {
		console.log("edited site is : ",this.state.site)
		await http.put(`/sites/${this.state.site._id}`,this.state.site)
			.then(edited_site => this.setState({site:edited_site}))
			.catch(err => console.error("Failed to edit site",err))
			.finally(this.props.onClose);
	};

	render(){
		return(<div>
			<Dialog
				open={true}
				onClose={this.props.onClose}
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
						onChange={(e) => this.update_site("name",e.target.value)}
					/>
					<TextField
						margin="dense"
						id="description"
						label="Site Description"
						fullWidth
						multiline
						rows={10}
						value={this.state.site.description}
						onChange={(e) => this.update_site("description",e.target.value)}
					/>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<TextField
								margin="dense"
								id="location"
								label="Location"
								fullWidth
								value={this.state.site.location}
								onChange={(e) => this.update_site("location",e.target.value)}
							/>
						</Grid>
						<RegionList
							selected_region_id={this.state.site.region_id}
							select_region = {(reg_id) => this.update_site("region_id",reg_id)}
						/>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.props.onClose} color="primary">
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
