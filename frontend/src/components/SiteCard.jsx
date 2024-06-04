import React, {Component} from "react";
import http from "../../http.js";
import {Card, CardContent, Grid, Typography} from "@mui/material";
import {Link} from "react-router-dom";

class SiteCard extends Component {

    /**
     *
     * @param props
     * @param props.site {_id:String,name:_string, region_id:id of our region} the site we will represent
     *
     */
	constructor(props) {
		super(props);

		this.state = {
			_id: this.props.site._id,
			name: this.props.site.name,
			region_name: "loading...",
		};
	}

	async componentDidMount() {
		await http.get(`/regions/${this.props.site.region_id}`)
			.then(reg => {
				this.setState({region_name: reg.data.name});
			})
			.catch(err => console.error(`Failed to retrieve details for site ${this.props.site._id}, region: ${this.props.region_id}`,
				err));
	}

	render() {
		return (
			<Grid item xl={2} key={this.props.site._id}>
				<Link to={`/site/${this.props._id}`} state={{info: this.props.site}}>
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
								{this.state.region_name.length <= 15
									? this.state.region_name
									: this.state.region_name.substr(0, 15) + "..."}
							</Typography>
							<Typography variant="body2" component="p">
								{this.props.site._id}
							</Typography>
						</CardContent>
					</Card>
				</Link>
			</Grid>
		);
	}
}

export default SiteCard;
