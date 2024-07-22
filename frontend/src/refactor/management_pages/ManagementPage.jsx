/* eslint-disable react/prop-types */
import {Component} from "react";
import Box from "@mui/material/Box";
import Sidebar from "../../components/Sidebar.jsx";
import {Alert, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import {UserContext} from "../../context/userContext.jsx";
import DeleteConfirmDialog from "../DeleteConfirmDialog.jsx";
import http from "../../../http.js";
import AddIcon from "@mui/icons-material/Add";

class ManagementPage extends Component{
    /**
     * @param props
     * @param props.url {String} the api location that manages this entity
     * @param props.subject {String} the entity we are managing
     * @param props.context {UserContext} the entity we are managing
     *
     *
     */
    constructor(props) {
        super(props);

        this.state = {
            rows:[],
            dialog_open:false,
            adding_new:false,
            alert:{open:false,message:""},
            delete_confirmation:{open:false,ent:null}, //todo remove if we can
            selected:null,
            dialog:false,
        }
    }

    //Abstract methods
    /**
     * Opens the selected entity for editing
     * @abstract
     */
    generate_editor(){ }

    /**
     * Generates the cols for the managment table
     * @abstract
     */
    generate_cols(){}

    /**
     * Fetches the entities that will populate our rows
     * @abstract
     */
    fetch_entities(){}


    //Event Handlers

    /**
     * Handles calling the passed delete method
     * @returns {Promise<void>}
     */
    async handleDelete(ent){
        this.setState({delete_confirmation:{open:true,ent:ent}});
    }

    /**
     * Sets the selected entity and opens the dialog for editing
     * @param entity
     */
    handleEdit(entity){
        this.setState({selected:entity,dialog:true,adding_new:false})
    }

    /**
     * handles making the API call for the deletion of an item
     * @param entity_id {String} the ID of the entity to delete
     */
    async delete_entity(entity_id){
        return http.delete(`${this.props.url}/${entity_id}`)
            .then(() => {
                this.remove(entity_id)
                this.alert_success("delete");
            })
            .catch(err => {
                    console.error(`failed to delete ${this.props.subject}: ${JSON.stringify(entity_id)}`,err);
                    this.alert_failure("delete");
            })
            .finally( () => this.setState({delete_confirmation:{open:false}}));
    }

    //Row Modifiers
    /**
     * Adds a new entity to the list of entities we are tracking
     * @param new_ent
     */
    append_new(new_ent){
        new_ent["id"] = new_ent._id; //set id field for MUI
        let old_rows = this.state.rows;
        this.setState({rows:[...old_rows, {...new_ent, isNew: true}]}); // Add new period to local state
    }

    /**
     * Removes the entity from the UI
     * @param ent_id {String} - the entity to remove
     */
    remove(ent_id) {
        //This could be done better
        let updated_rows = this.state.rows.filter((row) => row._id !== ent_id);
        this.setState({rows:updated_rows});
    }

    //Alerts
    /**
     * Sets the alert to a success message
     * @param action - the action we have succeeded in doing
     */
    alert_success(action){
       this.setState({alert:{
               open: true,
               type: "success",
               message: ` ${this.props.subject} successfully ${action}.`,
           }
       })
    }

    alert_failure(action){
        this.setState({alert:{
                open: true,
                type: "error",
                message: ` Failed to ${action} ${this.props.subject}.`,
            }
        })
    }

    componentDidMount() {
        try{
            this.fetch_entities()
        } catch(err){
            console.error(`Failed to fetch entities`,err)
        }
    }

    render() {
        return(
            <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
                <Sidebar sx={{ width: 240, flexShrink: 0 }} />
                <Box sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ flexGrow: 1, p: 3 }}>
                        {this.state.alert.open && (
                            <Alert
                                severity={this.state.alert.type ?? "error"}
                                onClose={() => this.setState({alert:{open:false}})}
                                style={{ marginBottom: "20px" }}
                            >
                                {this.state.alert.message ?? "O NO"}
                            </Alert>
                        )}
                    </Box>
                    {/* Deletion confirmation dialog */}
                    {this.props.context && (
                        <DeleteConfirmDialog
                            open_condition={this.state.delete_confirmation.open}
                            on_cancel={() => this.setState({delete_confirmation:{open:false,ent:null}})}
                            on_proceed={() => this.delete_entity(this.state.delete_confirmation.ent._id)}
                            text={`Are you sure you'd like to delete ${this.props.subject} ${this.state.delete_confirmation.ent?.name ?? ""}`}
                            title={`Delete ${this.props.subject}?`}
                        />
                    )}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        <Typography variant="h6">{this.props.subject} Management</Typography>
                        {this.props.context && (
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => {this.setState({adding_new:true,dialog:true})}}
                                color="primary"
                            >
                                Add {this.props.subject}
                            </Button>
                        )}
                    </Box>
                    <DataGrid
                        rows={this.state.rows}
                        columns={this.generate_cols()}
                        pageSize={5}
                        autoHeight
                        disableSelectionOnClick
                        components={{
                            toolbar: this.props.context ? GridToolbar : undefined,
                        }}
                    />
                    {this.generate_editor()}
                </Box>
            </Box>
        )
   }
}

export default ManagementPage;