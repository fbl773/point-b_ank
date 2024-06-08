import React, {Component} from "react";
import http from "../../http.js";
import {IconButton, MenuItem} from "@mui/material";
import {Region} from "../entities/entities.js";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";


class RegionListItem extends Component{

    /**
     *
     * @param props
     *
     */
    constructor(props){
        super(props);
        this.on_delete = this.on_delete.bind(this);

        this.state = {
            region:Region
        }
    }

    componentDidMount() {
        this.setState({region:this.props.region})
    }

    /**
     * Handles the deletion of the represented region
     */
    on_delete = () => {
        http.delete(`/regions/${this.state.region._id}`)
            .then(() => {
                let region_id = this.state.region._id;
                console.log(`Successfully deleted region: ${region_id} `)
                this.props.on_delete()
            })
            .catch(err => console.error(`Failed to delete region: ${this.state.region._id}`,err));
    }

    render() {
        return(
            <MenuItem key={this.state.region._id}
                      value={this.state.region}
                      onClick={this.props.onClick}
            >
                {this.state.region.name}
                <IconButton
                    size="small"
                    onClick={this.on_delete}
                    style={{marginLeft:"auto"}}
                    >
                    <DeleteIcon/>
                </IconButton>
            </MenuItem>
        )
    }
}

export default RegionListItem;
