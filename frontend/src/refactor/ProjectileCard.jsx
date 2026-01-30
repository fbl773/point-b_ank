import React, {Component} from "react";
import { ButtonBase, Card, CardContent, Checkbox, Grid, Typography } from "@mui/material";
import ProjectileModal from "./modals/Projectile/ProjectileModal.jsx";
import { Stack } from "@mui/system";

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
        this.state = {
            showPoint:false,
            entity:props.item
        }

        if(this.state.culture_id === ""){
            throw Error(`IDK man here are the props: ${props.item.culture_id}, here is the state: ${this.state.culture_id}`);
        }
    }

    render() {
        return (
            <>
            <ButtonBase onClick={() => this.setState({showPoint:true})}>
            <Card
                sx={{
                    minWidth: "12rem",
                    minHeight: "12rem",
                    alignContent: "center",
                }}
            >
                <CardContent>
                    <Typography variant="h5" component="h3">
                        {this.props.site_name + "-" + this.props.item.location ?? "Unknown Location"}
                    </Typography>
                    <Typography variant="body2" component="p">
                        {/* Limit description characters to prevent text overflow */}
                        {this.props.item.description.length <= 15
                            ? this.props.item.description
                            : this.props.item.description.substr(0, 15) + "..."}
                    </Typography>
                </CardContent>
            </Card>
            </ButtonBase>
                {this.state.showPoint && (
                    <ProjectileModal
                        adding_new={false}
                        entity={this.state.entity}
                        subject={"projectile point"}
                        site_name={this.props.site_name}
                        site_id={this.state.entity.site_id}
                        url={"points"}
                        send_alert={(msg) => console.warn(`TODO: ${JSON.stringify(msg)}`)}
                        open={this.state.showPoint}
                        on_close={() => this.setState({showPoint: false})}
                        on_delete={this.props.onDelete}
                    />
                )}
            </>
        );
    }
}

export default ProjectileCard;
