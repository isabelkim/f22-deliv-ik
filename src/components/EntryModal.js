import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { useState } from 'react';
import { categories } from '../utils/categories';
import { addEntry } from '../utils/mutations';
import { updateEntry } from '../utils/mutations';
import { deleteEntry } from '../utils/mutations';
import { updateFavorites } from '../utils/mutations';

// Modal component for individual entries.

/* EntryModal parameters:
entry: Data about the entry in question
type: Type of entry modal being opened. 
   This can be "add" (for adding a new entry) or 
   "edit" (for opening or editing an existing entry from table).
user: User making query (The current logged in user). */

export default function EntryModal({ entry, type, user }) {

   // State variables for modal status

   // For editing, you may have to add and manage another state variable to check if the entry is being edited.

   const [open, setOpen] = useState(false);
   const [name, setName] = useState(entry.name);
   const [link, setLink] = useState(entry.link);
   const [description, setDescription] = useState(entry.description);
   const [category, setCategory] = React.useState(entry.category);

   // Toggle between "Edit" and "Save"
   const [text, setText] = useState("Edit");

   // Modal visibility handlers
   const handleClickOpen = () => {
      setText("Edit");
      setOpen(true);
      setName(entry.name);
      setLink(entry.link);
      setDescription(entry.description);
      setCategory(entry.category);
   };

   const handleClose = () => {
      setOpen(false);
      setAlert(false)
      setQr(false)
   };

   // Mutation handlers
   const handleAdd = () => {
      const newEntry = {
         name: name,
         link: link,
         description: description,
         user: user?.displayName ? user?.displayName : "GenericUser",
         category: category,
         userid: user?.uid,
      };

      addEntry(newEntry).catch(console.error);
      handleClose();
      setText("Edit")
   };

   const [click, setClick] = useState(false)

   // Add Edit Mutation Handler
   const handleEdit = () => {
      if (click) {
         const updatedEntry = {
            name: name,
            link: link,
            description: description,
            user: entry.user,
            category: category,
            userid: entry.userid,
            id: entry.id
         };
   
         updateEntry(updatedEntry).catch(console.error);
         handleClose();
         setClick(false)
         setText("Edit")
      }

      else {
         setClick(true)
         setText("Save")
      }
   };



   // Add Delete Mutation Handler

   const handleDelete = () => {
      const deletingEntry = {
         name: name,
         link: link,
         description: description,
         user: entry.user,
         category: category,
         userid: entry.userid,
         id: entry.id
      };

      deleteEntry(deletingEntry).catch(console.error);
      handleClose();
   };

   // Alert popup
   const [alert, setAlert] = React.useState(false);

   const handleAlert = () => {
     setAlert(true);
   };

   // Favorites
   const [saveText, setSaveText] = useState("Favorite");

   const handleSave = () => {
      if (entry.favorites) {
         setSaveText("Favorite");
         entry.favorites = false
         updateFavorites(entry).catch(console.error);
      }
      else {
         setSaveText("Remove From Favorites");
         entry.favorites = true
         updateFavorites(entry).catch(console.error);
      }
   };

   const favoritesButton =
   type === "edit" ? <Button onClick={handleSave}>{saveText}</Button>
      : null;

   // QR Code
   const [qr, setQr] = React.useState(false);
   const handleQr = () => {
      setQr(true);
   };

   function showQR(qr) {
      if (!qr) return (
         <Button onClick={handleQr} autoFocus>Generate QR Code</Button>
      );
      return (
         <img show={qr} src={`https://api.qrserver.com/v1/create-qr-code/?data=${link}&amp;size=300x300`} alt="QR" title="" />
      )
   }

   // Button handlers for modal opening and inside-modal actions.
   // These buttons are displayed conditionally based on if adding or editing/opening.
   // TODO: You may have to edit these buttons to implement editing/deleting functionality.

   const openButton =
      type === "edit" ? <IconButton onClick={handleClickOpen}>
         <OpenInNewIcon />
      </IconButton>
         : type === "add" ? <Button variant="contained" onClick={handleClickOpen}>
            Add entry
         </Button>
            : null;

   const actionButtons =
      type === "edit" ?
         <DialogActions>
            {/* Cancel button for what pops up when "Open" is pressed */}
            <Button onClick={handleClose}>Cancel</Button>
            {/* Delete button for what pops up when "Open" is pressed */}
            <Button onClick={handleAlert}>Delete</Button>
            {/* Added button to edit */}
            <Button variant="contained" onClick={handleEdit}>{text}</Button>
         </DialogActions>
         : type === "add" ?
            <DialogActions>
               {/* Cancel button for adding entry */}
               <Button onClick={handleClose}>Cancel</Button>
               {/* Add Entry button once you click Add Entry */}
               <Button variant="contained" onClick={handleAdd}>Add Entry</Button>
            </DialogActions>
            : null;
         

   return (
      <div>
         <div>
            <Dialog
            open={alert}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            >
            <DialogContent>
               <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this entry?
               </DialogContentText>
            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose}>Cancel</Button>
               <Button onClick={handleDelete} autoFocus>
                  OK
               </Button>
            </DialogActions>
            </Dialog>
         </div>
         {openButton}
         <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{type === "edit" ? name : "Add Entry"}</DialogTitle>
            {favoritesButton}
            <DialogContent>
               {/* TODO: Feel free to change the properties of these components to implement editing functionality. The InputProps props class for these MUI components allows you to change their traditional CSS properties. */}
               <TextField
                  margin="normal"
                  id="name"
                  label="Name"
                  fullWidth
                  variant="standard"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  InputProps={{readOnly: ((type === "edit") && !click)}}
               />
               <TextField
                  margin="normal"
                  id="link"
                  label="Link"
                  placeholder="e.g. https://google.com"
                  fullWidth
                  variant="standard"
                  value={link}
                  onChange={(event) => setLink(event.target.value)}
                  InputProps={{readOnly: ((type === "edit") && !click)}}
               />
               <br/>
               {/* <Button onClick={handleQr} autoFocus>Generate QR Code
               </Button> */}
               {/* QR Code */}
                  <div>
                     { showQR(qr) }
                  </div>
               <TextField
                  margin="normal"
                  id="description"
                  label="Description"
                  fullWidth
                  variant="standard"
                  multiline
                  maxRows={8}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  InputProps={{readOnly: ((type === "edit") && !click)}}
               />

               <FormControl fullWidth sx={{ "margin-top": 20 }}>
                  <InputLabel id="demo-simple-select-label">Category</InputLabel>
                  <Select
                     inputProps={{readOnly: ((type === "edit") && !click)}}
                     labelId="demo-simple-select-label"
                     id="demo-simple-select"
                     value={category}
                     label="Category"
                     onChange={(event) => setCategory(event.target.value)}
                  >
                     {categories.map((category) => (<MenuItem value={category.id}>{category.name}</MenuItem>))}
                  </Select>
               </FormControl>
            </DialogContent>
            {actionButtons}
         </Dialog>
         {/* <Container className="mt-4">
            <Row>
            <Col md={{ span: 10, offset: 1 }}>
               <Card className="mt-2">
                  <Card.Body>
                  {<Alert variant="success">a</Alert>}
                  </Card.Body>
               </Card>
            </Col>
            </Row>
            <DeleteConfirmation showModal={displayConfirmationModal} confirmModal={handleDelete} hideModal={hideConfirmationModal} message={deleteMessage}  />
         </Container> */}
      </div>
   );
}