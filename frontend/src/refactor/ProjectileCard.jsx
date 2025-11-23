import React, {Component} from "react";
import {Card, CardContent, Grid, Typography} from "@mui/material";

class ProjectileCard extends Component {

    /**
     *
     * @param props
     * @param props.site_name {string} - the name of the site hosting the PP
     * @param props.item - the Projectile Point we are representing
     * @param props.item.description {string} - description of the PP
     * @param props.item._id {string} - id of the PP
     *
     *
     */
    constructor(props) {
        super(props);
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
                        {this.props.site_name + "-" + this.props.item.location}
                    </Typography>
                    <Typography variant="body2" component="p">
                        {/* Limit description characters to prevent text overflow */}
                        {this.props.item.description.length <= 15
                            ? this.props.item.description
                            : this.props.item.description.substr(0, 15) + "..."}
                    </Typography>
                </CardContent>
            </Card>
        );
    }
}

export default ProjectileCard;
