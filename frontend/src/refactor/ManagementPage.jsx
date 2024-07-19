/* eslint-disable react/prop-types */
import {Component, useContext} from "react";
import http from "../../http";
import Box from "@mui/material/Box";
import Sidebar from "../components/Sidebar.jsx";
import {Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add.js";
import {DataGrid, GridToolbar} from "@mui/x-data-grid";
import PeriodModal from "./PeriodModal.jsx";
import {UserContext} from "../context/userContext.jsx";


const { user } = useContext(UserContext);

class ManagementPage extends Component{

    /**
     *
     * @param props
     * @param props.url {String} the api location that manages this entity
     * @param props.subject {String} the entity we are managing
     * @param props.cols {[]} the columns for this managment page
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

    /**
     * Adds a new entity to the list of entities we are tracking
     * @param ent:MongoEntity {_id:String} - the entity to add
     */
    append_new(ent){
        throw("Unimplemented")
    }

    /**
     * Removes the entity from the UI
     * @param ent:MongoEntity {_id:String} - the entity to remove
     */
    remove(ent) {
        throw("Unimplemented")
    }

    /**
     * Opens the passed enity for editing by selecting it
     * @param ent
     */
    edit(ent){
        throw("Unimplemented")
    }

    /**
     * Sets the alert to a success message
     * @param ent_name - the name of the entity we are operating on
     * @param action - the action we have succeeded in doing
     */
    alert_success(ent_name,action){
       this.setState({alert:{
               open: true,
               type: "success",
               message: ` ${ent_name} successfully ${action}.`,
           }
       })
    }

    alert_failure(ent_name,action){
        this.setState({alert:{
                open: true,
                type: "error",
                message: ` Failed to ${action} ${ent_name}.`,
            }
        })
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
                    {/* Deletion confirmation dialog : TODO*/}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 2,
                        }}
                    >
                        <Typography variant="h6">{this.props.subject} Management</Typography>
                        {user && (
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
                        rows={rows}
                        columns={columns}
                        pageSize={5}
                        autoHeight
                        disableSelectionOnClick
                        components={{
                            toolbar: user ? GridToolbar : undefined,
                        }}
                    />
                    {this.state.dialog &&
                        <PeriodModal
                            open={this.state.dialog}
                            onClose={() => this.setState({dialog:false})}
                            adding_new={this.state.adding_new}
                            append_period={(new_ent) => this.append_new(new_ent)}
                            on_success={this.alert_success}// Show success message
                            selected_period={selectedPeriod}
                        />}
                </Box>
            </Box>
        )
   }


}