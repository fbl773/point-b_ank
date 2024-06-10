import React, {Component} from "react";
import http from "../../http.js";
import {IconButton, MenuItem} from "@mui/material";
import {Region} from "../entities/entities.js";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";


/**
 * A region item in the list of regions for a dropdown
 */
class RegionListItem extends Component{

    /**
     *
     * @param props
     * @param props.region:Region - the region this list item represents
     * @param props.onClick:Function - on select operation
     * @param props.on_delete:Function - on delete operation
     */
    constructor(props){
        super(props);

        this.state = {
            region:Region
        }
    }

    /**
     * Assignes the site's region details according to the passed region
     */
    componentDidMount() {
        this.setState({region:this.props.region})
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
