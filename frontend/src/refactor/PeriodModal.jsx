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

class PeriodModal extends Component{

	/**
	 * Constructs the modal to creat a new period
	 * @param props
	 * @param props.onClose:Function how we close this modal.
	 * @param adding_new:Boolean - true/false are we creating a period
	 * @param props.append_period:Function how we close this modal.
	 */
	constructor(props) {
		super(props);

		let title = "Add"
		if(this.props.adding_new){
			this.handleSubmit = this.addPeriod.bind(this);
		} else {
			this.handleSubmit = this.editPeriod.bind(this);
			title="Edit";
		}

		this.state = {
			title:title,
			period: {
				_id: "",
				name: "",
				start: 0,
				end: 0
			}
		}
	}

	/**
	 * Updates the contained period sub-object
	 * @param key:String the key to the field of a period object we seek to edit
	 * @param val:any the value to set it to
	 */
	update_period = (key,val) =>{
		let updated_period = this.state.period;
		updated_period[key] = val;
		this.setState({period:updated_period});
	}
	/**
	 * Validates the save conditions
	 * @return name is longer than 0 and ybp_start > ybp_end
	 */
	validate = () =>{
		let period = this.state.period;
		let name_vaid = period.name.length > 0;
		let dates_valid = period.start >= period.end; //Dates are in bp (before present)...
		return name_vaid && dates_valid;
	}

	/**
	 * Creates a period out of the modal's state, and appends it to the list of periods on success.
	 */
	addPeriod = async () => {
		let period= this.state.period;
		delete period._id; //_id cannot be present when adding new
		alert(`Would ADD: ${JSON.stringify(period)}`)
		// if(this.validate()) {
		// 	http.post("/periods", period)
		// 		.then(resp => {
		// 			let new_period = resp.data.new_ent;
		// 			console.log("Successfully added period: ", period)
		// 			this.props.append_period(new_period);
		// 		})
		// 		.then(this.props.onClose)
		// 		.catch(err => console.error("Failed to add new period: ", err))
		// } else {
		// 	console.error("Period is invalid.")
		// }
	}

	/**
	 * Edits a period
	 * @return {Promise<void>}
	 */
	editPeriod = async () => {
		let period = this.state.period;
		alert(`Would EDIT: ${JSON.stringify(period)}`)
		// console.log("edited period is : ",period)
		// await http.put(`/periods/${period._id}`,period)
		// 	.then(edited_period => this.setState({period:edited_period}))
		// 	.catch(err => console.error("Failed to edit period",err))
		// 	.finally(this.props.onClose);
	}


	render(){
		return(
			<div>
			<Dialog open={this.props.open} onClose={this.props.onClose}>
				<DialogTitle>
					{this.state.title} Period
				</DialogTitle>
				<DialogContent>
					<TextField
						id="name"
						label="Name"
						variant="outlined"
						fullWidth
						value={this.state.period.name}
						onChange={(e) => this.update_period("name",e.target.value)}
						margin="normal"
					/>
					<TextField
						id="start_bp"
						label="start"
						variant="outlined"
						type="number"
						inputProps={{
							inputMode:"numeric",
							pattern: '/^-?\d+(?:\.\d+)?$/g'
						}}
						fullWidth
						value={this.state.start}
						onChange={(e) => this.update_period("start",e.target.value)}
					/>
					<TextField
						id="end_bp"
						label="end"
						variant="outlined"
						type="number"
						fullWidth
						value={this.state.end}
						onChange={(e) => this.update_period("end",e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={this.props.onClose} color="primary">
						Cancel
					</Button>
					<Button onClick={this.handleSubmit} color="primary">
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	)}
}

export default PeriodModal;
