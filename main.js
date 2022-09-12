 
"use strict";

let notesContainer = document.getElementById("app");             // Get the container element
let addNoteButton = notesContainer.querySelector(".add-note");   // Get the add Note button element
addNoteButton.addEventListener("click", () => addNote());     // Add Note Button event listener

let fragment = document.createDocumentFragment();    // Create the fragment for a refresh page

getNotes().forEach((note) => {     // Get the notes and create the elements to be rendered
  createInsertNotesElements(note.id, note.content, note.creationDate, note.dateUpdate);
});
fragment.appendChild(addNoteButton);   // Add the button to the fragment
notesContainer.appendChild(fragment);  // Add the fragment to the container


function createInsertNotesElements(id, content, creationDate, dateUpdate){
    let elements = createNoteElements(id, content, creationDate, dateUpdate);
    fragment.appendChild(elements[0]);    // Each element is added to the fragment
    fragment.appendChild(elements[1]);    // Each element is added to the fragment
    fragment.appendChild(elements[2]);    // Each element is added to the fragment
}

function createNoteElements(id, content, creationDate, dateUpdate){
  let textElement = createTextElement(id, content, creationDate);  
  let deleteButtom = createDeleteButtom(id);
  let datesInfoArea = createDatesInfoArea(creationDate, dateUpdate);
  return [textElement, deleteButtom, datesInfoArea];  
}
function createTextElement(id, content, creationDate) {   // Create the text area element  
  let element = document.createElement("textarea");
  element.classList.add("note");
  element.value = content;
  element.placeholder = "Write Here";
  element.addEventListener("change", () => {                 // Add a element event listener (change)
    updateNote(id, element.value, element, creationDate);    // Update the information 
  });
  element.addEventListener('keyup', function(e) {
    if (e.key == 'Tab') {                            // New element listener for Tab key 
      e.preventDefault();
      let start = this.selectionStart;
      let end = this.selectionEnd;
      this.value = this.value.substring(0, start) +
        "\t" + this.value.substring(end);
      this.selectionStart =
        this.selectionEnd = start + 1;
    }
    updateNote(id, element.value, element, creationDate);   // Update the information
  });
  return element;
}

function createDeleteButtom(id) {   // create a "Del Note button"
  let element = document.createElement("div");
  element.classList.add("delete");
  element.innerHTML = '<b>- Del Note</b>';
  element.addEventListener("click", () => {
    let doDelete = confirm("Do you want to delete this note?"
    );
    if (doDelete) {
      deleteNote(id, element);         
    }
  });
  return element;
}

function createDatesInfoArea(creationDate, dateUpdate) {     // create the tirdh element
  let element = document.createElement("div");
  element.classList.add("date");
  element.innerHTML = '<b>Creation date:</b> ' + creationDate + ', <b>Last update:</b> '+ dateUpdate;
  return element;
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

  let elements = createNoteElements(noteObject.id, noteObject.content, noteObject.creationDate, noteObject.dateUpdate);
  let fragment2 = document.createDocumentFragment();
  fragment2.appendChild(elements[0]);
  fragment2.appendChild(elements[1]);
  fragment2.appendChild(elements[2]);
  notesContainer.insertBefore(fragment2, addNoteButton);
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

