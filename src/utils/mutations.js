import { addDoc, collection } from "firebase/firestore";
import { db } from './firebase';
import { doc, updateDoc } from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";

// Functions for database mutations

export const emptyEntry = {
   name: "",
   link: "",
   description: "",
   user: "",
   category: 0,
   datetime: "",
   favorites: false
}

export async function addEntry(entry) {
   await addDoc(collection(db, "entries"), {
      name: entry.name,
      link: entry.link,
      description: entry.description,
      user: entry.user,
      category: entry.category,
      // The ID of the current user is logged with the new entry for database user-access functionality.
      // You should not remove this userid property, otherwise your logged entries will not display.
      userid: entry.userid,
      datetime: new Date(),
      favorites: false
   });
}



export async function updateEntry(entry) {
   // TODO: Create Mutation to Edit Entry
   await updateDoc(doc(db, "entries", entry.id), {
      name: entry.name,
      link: entry.link,
      description: entry.description,
      user: entry.user,
      category: entry.category,
      // The ID of the current user is logged with the new entry for database user-access functionality.
      // You should not remove this userid property, otherwise your logged entries will not display.
      userid: entry.userid,
      // id: entry.id
   });
}

export async function updateFavorites(entry) {
   // Favorites
   await updateDoc(doc(db, "entries", entry.id), {
      favorites: entry.favorites
   });
}

export async function deleteEntry(entry) {
   // TODO: Create Mutation to Delete Entry
   await deleteDoc(doc(db, "entries", entry.id));
}