import {useState} from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
export default function ErrorDialog(props){
    const [open, setOpen] = useState(props.open_condition);

    return(
        <Dialog
            open={open}
            onClose={()=>setOpen(false)}
        >
            <DialogTitle>Error!</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {props.text}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={()=>setOpen(false)}>Dismiss</Button>
            </DialogActions>
        </Dialog>
    )
}