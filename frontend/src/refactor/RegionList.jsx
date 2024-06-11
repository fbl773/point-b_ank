import React, {Component} from "react";
import http from "../../http.js";
import {FormControl, Grid, InputLabel, MenuItem, Select} from "@mui/material";
import RegionListItem from "./RegionListItem.jsx";
import DeleteConfirmDialog from "./DeleteConfirmDialog.jsx";
import RegionModal from "./RegionModal.jsx";

/**
 * Generates a dropdown list or Regions that also manages their deletion
 */
class RegionList extends Component{

    /**
     *
     * @param props
     * @param props.
     */
    constructor(props) {
        super(props);

        this.delete_region = this.delete_region.bind(this);
        //this.append_region = this.append_region.bind(this);

        this.state = {
            regions:[],
            selected_region:"",
            del_region:{},
            show_del:false
        }
    }

    /**
     * Fetches the regions from the server and assigns them to the component, selecting the one active for the site
     * if it exists
     */
    componentDidMount() {
        http.get("/regions")
            .then(regs => {
                this.setState({regions: regs.data})

                //If we have been configured with a region, select it.
                if (this.props.selected_region_id !== undefined) {
                    let sel_reg = regs.data.find(reg => reg._id === this.props.selected_region_id);
                    this.select_region(sel_reg)
                }
            })
            .catch(err => console.error("Failed to fetch regions",err));
    }

    /**
     * Facilitates opening the deletion dialogue
     * @param reg:Region - the region to delete
     */
    confirm_reg_delete = (reg) => {
        this.setState({del_region:reg,show_del:true})
    }


    /**
     * Actually deletes the region of the supplied ID
     * @param reg_id:String the ID of the region to delete
     */
    delete_region = (reg_id) => {
        http.delete(`/regions/${reg_id}`)
            .then(() => {
                console.log(`Successfully deleted region: ${reg_id} `)
                let regions_updated = this.state.regions.filter(reg => reg._id !== reg_id)
                this.setState({regions:regions_updated,
                    del_reg:{},
                    show_del:false,
                    selected_region:""//todo this blanks the set region, even if the deleted one is not the set one...
                });
            })
            .catch(err => console.error(`Failed to delete region: ${this.state.region._id}`,err));
    }

    /**
     * Sets a region as selected
     * @param reg:Region The region to set as selected
     */
    select_region = (reg) => {
        let reg_name = reg.name ?? "";
        let reg_id = reg._id ?? "";
        this.props.select_region(reg_id);
        this.setState({selected_region:reg_name})
    }

    append_region = (reg) => {
        console.log("APpending: ",reg)
        let new_regions = this.state.regions;
        new_regions.push(reg);
        this.setState({regions:new_regions,selected_region:reg.name});
        this.props.select_region(reg._id);
    }

    render() {
        return(
            <Grid item xs={6}>
                <FormControl sx={{ mt: 1, width: "100%" }}>
                    <InputLabel id="region-label">Region</InputLabel>
                    <Select
                        id="region"
                        label="Region"
                        labelId="region-label"
                        value={this.state.selected_region ?? ""}
                        onChange={(e) => this.select_region(e.target.value)}
                        renderValue={(selected) => selected}
                        >
                    {this.state.regions.map((reg) => (
                        <RegionListItem
                            region={reg}
                            on_delete={() => this.confirm_reg_delete(reg)}
                            value={reg}
                            onClick = {this.select_region}
                        />)
                    )}
                        <MenuItem key="none" value="" onClick={this.select_region}>(No Region)</MenuItem>
                        <MenuItem key="add_new"
                                  value=""
                                  selected={false}
                                  onClick={() => this.setState({add_region:true})}
                        >
                            + New Region
                        </MenuItem>
                    </Select>
                </FormControl>
                {this.state.add_region && <RegionModal
                    onClose={() => this.setState({add_region:false})}
                    append_region={this.append_region}
                />}
                <div>
                    <DeleteConfirmDialog
                        open_condition={this.state.show_del}
                        title={`Delete Region ${this.state.del_region.name ?? ""}`}
                        text={`Are you sure you want to delete ${this.state.del_region.name ?? ""}? This will unset it for all related sites.`}
                        on_cancel={() => this.setState({del_region:{},show_del:false})}
                        on_proceed={() => this.delete_region(this.state.del_region._id ?? "")}/>
                </div>
            </Grid>
        )
    }
}

export default RegionList;
