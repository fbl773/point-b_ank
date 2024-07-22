import {Component} from "react";
import http from "../../http.js"
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@mui/material";

/**
 * A list of valid artifact types
 * @type {string[]}
 */
const artifact_types = ["Lithic","Faunal","Ceramic","Other"];

class MaterialModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: "...",
            selected:{},
            entity:{
                _id:"",
                name:"",
                description:"",
                artifact_type:"",
            }
        }
    }

    componentDidMount() {
        //Dynamically configure functionality to fit configured option
        if(this.props.adding_new){
            this.handle_submit = this.addCulture.bind(this);
            this.setState({title:"Add"});
        } else {
            this.handle_submit = this.editCulture.bind(this);
            this.setState({title:"Edit",entity:this.props.entity});
        }
    }

    update_entity = (key,val) => {
        let updated_entity= this.state.culture;
        updated_entity[key] = val;
        this.setState({entity:updated_entity});
    }

    validate(){
        let material = this.state.entity;
        let name_valid = material.name.length > 0;
        let type_valid = artifact_types
            .find(artifact_type => artifact_type === material.name) !== undefined;

        return name_valid && type_valid;
    }

    set_selected_artifact_type(artifact_type){
        this.update_entity('artifact_type',artifact_type);
    }

    async addEntity(){
        let material = this.state.entity;
        delete material._id;

        if(this.validate()){
            http.post("/materials",material)
                .then(resp => {
                    let new_mat = resp.data.new_ent;
                    this.props.append_new(new_mat);
                })
                .then(this.props.on_close)
                .then(this.props.on_success({open:true,type:"success",message:"New Material added"}))
                .catch(err => console.log(err));
        } else {
            console.error("Material is Invalid");
        }
    }

    async editEntity(){
        let material = this.state.entity;
        await http.put(`/materials/${material._id}`,material)
            .then(edited_ent=> this.setState({entity:edited_ent}))
            .then(this.props.on_success({open:true,type:"success",message:"Material successfully edited."}))
            .catch(err => console.error("Failed to edit material",err))
            .finally(this.props.on_close);
    }

    render(){
        return(
            <div>
                <Dialog open={this.props.open} onClose={this.props.on_close}>
                    <DialogTitle>
                        {this.state.title} Material
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            id="name"
                            label="Material Name"
                            variant="outlined"
                            fullWidth
                            value={this.state.entity.name}
                            onChange={(e) => this.update_entity("name",e.target.value)}
                            style={{ marginBottom: "15px", marginTop: "15px" }}
                        />
                        <TextField
                            id="description"
                            label="Material Description"
                            variant="outlined"
                            fullWidth
                            value={this.state.entity.description}
                            onChange={(e) => this.update_entity("description",e.target.value)}
                            style={{ marginBottom: "15px" }}
                        />
                        <TextField
                            select
                            label="Associated Artifact Type"
                            variant="outlined"
                            fullWidth
                            value={this.state.entity.artifact_type}
                            onChange={(e) => this.update_entity("artifact_type",e.target.value)}
                            SelectProps={{
                                native: true,
                            }}
                            style={{ marginBottom: "15px" }}
                        >
                            <option value=""></option>
                            {artifact_types.map((artifact_name) => (
                                <option key={artifact_name} value={artifact_name}>
                                    {artifact_name}
                                </option>
                            ))}
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.on_close} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.handle_submit} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

}


export default MaterialModal;
