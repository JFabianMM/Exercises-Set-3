"use strict";

let clone;
let notesContainer = document.getElementById("app");            // Get the container element
let addNoteButton = notesContainer.querySelector(".add-note");  // Get the add Note button element
addNoteButton.addEventListener("click", () => addNote());       // Add Note Button event listener

let fragment = document.createDocumentFragment();               // Create the fragment for a refresh page

getNotes().forEach((note) => {     // Get the notes and create the elements to be rendered
  clone= createInsertNotesElements(note.id, note.content, note.creationDate, note.dateUpdate);
  fragment.appendChild(clone);          // Each template is added to the fragment
});

fragment.appendChild(addNoteButton);   // Add the button to the fragment
notesContainer.appendChild(fragment);  // Add the fragment to the container

function createInsertNotesElements(id, content, creationDate, dateUpdate){
  const template = document.querySelector('#noteContainer');
  const clone = template.content.cloneNode(true);
  let textElement = clone.querySelector("textarea");
  textElement.value = content;
  textElement.onkeydown = function(){
    if(event.keyCode===9){
      let v=this.value;
      let s=this.selectionStart;
      let e=this.selectionEnd;
      this.value=v.substring(0, s)+'\t'+v.substring(e);
      this.selectionStart=this.selectionEnd=s+1;
      return false;
    }
    updateNote(id, textElement.value, textElement, creationDate);
  };
  textElement.onkeyup = function(){
       updateNote(id, textElement.value, textElement, creationDate);
  };

  let divElements = clone.querySelectorAll("div");
  divElements[0].addEventListener("click", () => {
    let doDelete = confirm("Do you want to delete this note?");
    if (doDelete) {
      deleteNote(id, divElements[0]);         
    }
  });
  divElements[1].innerHTML = '<b>Creation date:</b> ' + creationDate + ', <b>Last update:</b> '+ dateUpdate;
  return clone;
}

function getNotes() {
  return JSON.parse(localStorage.getItem("notes-stored") || "[]");   // Get the notes information from local storage 
}

function saveNotes(notes) {
  localStorage.setItem("notes-stored", JSON.stringify(notes));   // Save the notes information in local storage 
}

function addNote() {
  let dateCreation= new Date().toLocaleString();
  let dateUpdate= new Date().toLocaleString();
  let notes = getNotes();
  let id;
  if (notes.length==0){
    id=1;
  }else{
    id=notes[notes.length-1].id+1;  
  }
  let noteObject = {
    id: id,
    content: "",
    creationDate: dateCreation,
    dateUpdate: dateUpdate
  };

  clone = createInsertNotesElements (noteObject.id, noteObject.content, noteObject.creationDate, noteObject.dateUpdate);
  notesContainer.insertBefore(clone, addNoteButton);
  notes.push(noteObject);
  saveNotes(notes);
}

function updateNote(id, newContent, element, creationDate) {
  let notes = getNotes();
  let targetNote = notes.filter((note) => note.id == id)[0];
  targetNote.content = newContent;
  targetNote.dateUpdate=new Date().toLocaleString();
  let index = Array.from(
     element.parentElement.children
   ).indexOf(element);
  let element_date=notesContainer.children[index+2];
  element_date.innerHTML = '<b>Creation date:</b> ' + creationDate + ', <b>Last update:</b> '+ targetNote.dateUpdate;
  saveNotes(notes);
}

function deleteNote(id, element) {
  let notes = getNotes().filter((note) => note.id != id);
  saveNotes(notes);
  let index = Array.from(
    element.parentElement.children
  ).indexOf(element);
  notesContainer.removeChild(notesContainer.children[index+1]);
  notesContainer.removeChild(notesContainer.children[index]);
  notesContainer.removeChild(notesContainer.children[index-1]);
}

