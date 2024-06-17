/* eslint-disable react/prop-types */
import {
	TextField,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	DialogActions,
} from "@mui/material";
import {Component} from "react";
import http from "../../http";

class RegionModal extends Component{

	/**
	 * Constructs the modal to creat a new region
	 * @param props
	 * @param props.onClose:Function how we close this modal.
	 * @param props.append_region:Function how we close this modal.
	 */
	constructor(props) {
		super(props);

		this.state = {
			name:"",
			description:""
		}
	}

	/**
	 * Creates a region out of the modal's state, and appends it to the list of regions on success.
	 */
	saveRegion = () => {
		let region= this.state;
		//todo:validate better
		let can_save = region.name.length > 0 && region.description.length > 0;
		if(can_save) {
			http.post("/regions", region)
				.then(resp => {
					let new_reg = resp.data.new_ent;
					console.log("Successfully added region: ", new_reg)
					this.props.append_region(new_reg);
				})
				.then(this.props.onClose)
				.catch(err => console.error("Failed to add new region: ", err))
		} else {
			console.error("Please enter values to save a region.",region.name.length >= 1)
		}

	}

	render(){
		return(
			<div>
			<Dialog open={open} onClose={this.props.onClose}>
				<DialogTitle>
					Add New Region
				</DialogTitle>
				<DialogContent>
					<TextField
						id="name"
						label="Region Name"
						variant="outlined"
						fullWidth
						value={this.state.name}
						onChange={(e) => this.setState({name:e.target.value})}
						margin="normal"
					/>
					<TextField
						id="description"
						label="Description"
						multiline
						minRows={4}
						maxRows={10}
						variant="outlined"
						fullWidth
						value={this.state.description}
						onChange={(e) => this.setState({description:e.target.value})}
						margin="normal"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.props.onClose} color="primary">
						Cancel
					</Button>
					<Button onClick={this.saveRegion} color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)}
}

export default RegionModal;
