import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import EntryModal from './EntryModal';
import { getCategory } from '../utils/categories';

// Table component that displays entries on home screen

export default function EntryTable({ entries, category, option }) {

   // Function for sorting
   function sortEntries(entries, option) {
      if (option === "Most Recent") {
         return entries.sort((a,b) =>
            a.datetime > b.datetime ? -1 : 1
         )
      }
      else if (option === "Oldest") {
         return entries.sort((a,b) =>
            a.datetime < b.datetime ? -1 : 1
         )
      }
      else if (option === "Name") {
         return entries.sort((a,b) =>
            a.name < b.name ? -1 : 1
         )
      }

      // User
      else {
         return entries.sort((a,b) =>
            a.user < b.user ? -1 : 1
         )
      }
   }

     // Function for filtering (takes in entry and type)
   function checkFilter(entries, category) {
      if (category === "All") {
         return entries
      }
      else if (category === "Favorites") {
         return entries.filter(entry => entry.favorites)
      }
      else {
         return entries.filter(entry => getCategory(entry.category).name === category)
      }
   }

   let filteredArray = sortEntries(checkFilter(entries, category), option)

   return (
      <TableContainer component={Paper}>
         <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
               <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Link</TableCell>
                  <TableCell align="right">User</TableCell>
                  <TableCell align="right">Category</TableCell>
                  <TableCell align="right">Open</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {filteredArray.map((entry) => (
                  <TableRow
                     key={entry.id}
                     sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                     <TableCell component="th" scope="row">
                        {entry.name}
                     </TableCell>
                     <TableCell align="right"><Link href={entry.link}>{entry.link}</Link></TableCell>
                     <TableCell align="right">{entry.user}</TableCell>
                     <TableCell align="right">{getCategory(entry.category).name}</TableCell>
                     <TableCell sx={{ "padding-top": 0, "padding-bottom": 0 }} align="right">
                        <EntryModal entry={entry} type="edit" />
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </TableContainer>
   );
}
