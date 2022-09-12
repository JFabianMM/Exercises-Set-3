
"use strict";

let notesContainer = document.getElementById("app");             // Get the container element
let addNoteButton = notesContainer.querySelector(".add-note");   // Get the add Note button element

getNotes().forEach((note) => {     // Get the notes and create the elements to be rendered
  let noteElement = createNoteElement(note.id, note.content, note.creationDate, note.dateUpdate);  
  notesContainer.insertBefore(noteElement, addNoteButton);

  let noteElement2 = createNoteElement2(note.id, note.content, note.creationDate, note.dateUpdate);
  notesContainer.insertBefore(noteElement2, addNoteButton);
  
  let noteElement3 = createNoteElement3(note.id, note.content, note.creationDate, note.dateUpdate);
  notesContainer.insertBefore(noteElement3, addNoteButton);
});

addNoteButton.addEventListener("click", () => addNote());     // Add Note Button event listener

function getNotes() {
  return JSON.parse(localStorage.getItem("notes-stored") || "[]");   // Get the notes information from local storage 
}

function saveNotes(notes) {
  localStorage.setItem("notes-stored", JSON.stringify(notes));   // Save the notes information in local storage 
}

function createNoteElement(id, content, creationDate, Update) {   // Create the text area element  
  let element = document.createElement("textarea");
  element.classList.add("note");
  element.value = content;
  element.placeholder = "Write Here";

  element.addEventListener("change", () => {                 // Add a element event listener (change)
    updateNote(id, element.value, element, creationDate);    // Update the information 
  });

  element.addEventListener('keydown', function(e) {
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

function createNoteElement2(id, content, creationDate, dateUpdate) {   // create a "Del Note button"
  let element2 = document.createElement("div");
  element2.classList.add("delete");
  element2.innerHTML = '<b>- Del Note</b>';
  element2.addEventListener("click", () => {
    let doDelete = confirm("Do you want to delete this note?"
    );
    if (doDelete) {
      deleteNote(id, element2);         
    }
  });
  return element2;
}

function createNoteElement3(id, content, creationDate, dateUpdate) {     // create the tirdh element
  let element3 = document.createElement("div");
  element3.classList.add("date");
  element3.innerHTML = '<b>Creation date:</b> ' + creationDate + ', <b>Last update:</b> '+ dateUpdate;
  return element3;
}

function addNote() {
  let dateCreation= new Date().toLocaleString();
  let dateUpdate= new Date().toLocaleString();
  let notes = getNotes();
  let id1;
  if (notes.length==0){
    id1=1;
  }else{
    id1=notes[notes.length-1].id+1;  
}

  let noteObject = {
    id: id1,
    content: "",
    creationDate: dateCreation,
    dateUpdate: dateUpdate
  };

  let noteElement = createNoteElement(noteObject.id, noteObject.content, noteObject.creationDate, noteObject.dateUpdate);
  notesContainer.insertBefore(noteElement, addNoteButton);

  let noteElement2 = createNoteElement2(noteObject.id, noteObject.content, noteObject.creationDate, noteObject.dateUpdate);
  notesContainer.insertBefore(noteElement2, addNoteButton);

  let noteElement3 = createNoteElement3(noteObject.id, noteObject.content, noteObject.creationDate, noteObject.dateUpdate);
  notesContainer.insertBefore(noteElement3, addNoteButton);
  
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
   console.log(index)
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
