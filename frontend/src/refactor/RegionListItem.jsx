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


    render() {
        return(
            <MenuItem key={this.state.region._id}
                      value={this.state.region}
                      onClick={this.props.onClick}
            >
                {this.state.region.name}
                <IconButton
                    size="small"
                    onClick={this.props.on_delete}
                    style={{marginLeft:"auto"}}
                    >
                    <DeleteIcon/>
                </IconButton>
            </MenuItem>
        )
    }
}

export default RegionListItem;
