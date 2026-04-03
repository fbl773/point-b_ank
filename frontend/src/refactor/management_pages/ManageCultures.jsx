import ManagementPage from "./ManagementPage.jsx";
import http from "../../../http.js";
import {GridActionsCellItem} from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {CultureModal} from "../modals/Modals.jsx";
import {Culture} from "../../entities/entities.js";

class ManageCulture extends ManagementPage{
    constructor(props) {
        super(props);
    }

    /**
     * Maps a period_name to the period_id of a culture
     * @param culture - the culture we are going to assign the period name to
     * @returns {Promise<void>}
     */
    async map_period(culture){
        http.get('/periods/'+culture.period_id)
            .then(period => {
                culture['period_name']=period.data.name
            })
            .catch(err => {console.log("Failed to fetch period name",err);})
    }

    async fetch_entities() {
        http.get(this.props.url)
            .then(resp => {
                let cultures = resp.data;

                //Modify culture objects to fit MUI row criteria
                cultures.map(culture => { culture["id"] = culture._id })
                cultures.forEach(async culture => await this.map_period(culture))

                this.setState({rows:cultures});
            })
            .catch(err => console.log(`Error fetching cultures`,err));
    }

    generate_editor() {
        return (this.state.dialog &&
            <CultureModal
                open={this.state.dialog}
                subject={"culture"}
                url={"cultures"}
                entity={this.state.selected ?? Culture}
                adding_new={this.state.adding_new}
                append_new={(new_culture) => this.append_new(new_culture)}
                on_close={() => this.setState({dialog:false,selected:null})}
                send_alert={(props) => this.build_alert(props)}
            />
        )
    }

    generate_cols() {
        return [
            { field: "id", headerName: "ID", flex: 1, editable: false },
            { field: "name", headerName: "Name", flex: 2, editable: false },
            {
                field: "start",
                headerName: "Start Year",
                type: "number",
                flex: 1,
                editable: false,
            },
            {
                field: "end",
                headerName: "End Year",
                type: "number",
                flex: 1,
                editable: false,
            },
            {
                field:"period_name",
                headerName: "Period",
                flex:1,
                editable: false
            },
            {
                field: "actions",
                type: "actions",
                headerName: "Actions",
                flex: 1,
                cellClassName: "actions",
                getActions: (params) =>
                    this.props.context
                        ? [
                            <GridActionsCellItem
                                icon={<EditIcon />}
                                label="Edit"
                                onClick={() => {this.handleEdit(params.row)}}
                                color="inherit"
                            />,
                            <GridActionsCellItem
                                icon={<DeleteIcon />}
                                label="Delete"
                                onClick={() => this.handleDelete(params.row)}
                                color="inherit"
                            />
                        ]
                        : [],
            },
        ]
    }
}

export default ManageCulture;
