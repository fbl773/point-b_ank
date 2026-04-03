import React, {Component} from "react";
import http from "../../http.js";
import {Card, CardContent, Grid, Typography} from "@mui/material";

class SiteCard extends Component {

    /**
     *
     * @param props
     * @param props.site {_id:String,name:String, region_id:String} the site we will represent
     *
     */
	constructor(props) {
		super(props);

		this.state = {
			_id: this.props.site._id,
			name: this.props.site.name,
			region_name: "",
		};
	}

	/**
	 * When the site card loads, go fetch the details of the related region. if it has one...
	 * todo - fix the trigger that is preventing this functionality
	 * @return {Promise<void>}
	 */
	async componentDidMount() {
		if(this.props.site.region_id !== undefined) {
			await http.get(`/regions/${this.props.site.region_id}`)
				.then(reg => {
					this.setState({region_name: reg.data.name});
				})
				.catch(err => console.error(`Failed to retrieve details for site ${this.props.site._id}, region: ${this.props.region_id}`,
					err));
		}
	}

	/**
	 * Gets the region name, if it exists otherwise a placeholder../
	 * @return {*|string|string}
	 */
	get_region_name(){
		let region_name= this.state.region_name;
		if(region_name)
			return region_name.length<= 15 ? region_name : region_name.substr(0, 15) + "...";
		 else
			return "";
	}

	render() {
		return (
			<Card
				sx={{
					minWidth: "12rem",
					minHeight: "12rem",
					alignContent: "center",
				}}
			>
				<CardContent>
					<Typography variant="h5" component="h3">
						{this.state.name}
					</Typography>
					<Typography color="textSecondary" gutterBottom>
						{/* Limit description characters to prevent text overflow */}
						{this.get_region_name()}
					</Typography>
					<Typography variant="body2" component="p">
						{this.props.site._id}
					</Typography>
				</CardContent>
			</Card>
		);
	}
}

export default SiteCard;
