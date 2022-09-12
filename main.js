const notesContainer = document.getElementById("app");             // The element Container
const addNoteButton = notesContainer.querySelector(".add-note");   

getNotes().forEach((note) => {
  const noteElement = createNoteElement(note.id, note.content, note.creationDate, note.dateUpdate);
  notesContainer.insertBefore(noteElement, addNoteButton);

  const noteElement2 = createNoteElement2(note.id, note.content, note.creationDate, note.dateUpdate);
  notesContainer.insertBefore(noteElement2, addNoteButton);

});

addNoteButton.addEventListener("click", () => addNote());

function getNotes() {
  return JSON.parse(localStorage.getItem("notes-stored") || "[]");
}

function saveNotes(notes) {
  localStorage.setItem("notes-stored", JSON.stringify(notes));
}

function createNoteElement(id, content, creationDate, Update) {
  const element = document.createElement("textarea");
  element.classList.add("note");
  element.value = content;
  element.placeholder = "Write Here";

  element.addEventListener("change", () => {
    updateNote(id, element.value);
    notes = getNotes();
    saveNotes(notes);
  });

  element.addEventListener('keydown', function(e) {
    if (e.key == 'Tab') {
      e.preventDefault();
      var start = this.selectionStart;
      var end = this.selectionEnd;

      this.value = this.value.substring(0, start) +
        "\t" + this.value.substring(end);
  
      this.selectionStart =
        this.selectionEnd = start + 1;
    }

    updateNote(id, element.value);
    notes = getNotes();
    saveNotes(notes);
  });

    element.addEventListener("dblclick", () => {
    const doDelete = confirm("Do you want to delete this note?"
    );

    if (doDelete) {
      deleteNote(id, element);
    }
  });

  return element;
}

function createNoteElement2(id, content, creationDate, dateUpdate) {
  //const element2 = document.createElement("textarea");
  const element2 = document.createElement("div");
  element2.classList.add("date");
  element2.innerHTML = '<b>Creation date:</b> ' + creationDate + ', <b>Last update:</b> '+ dateUpdate;
  //element2.value = 'Creation date: ' + creationDate + '          ' + 'Last Update: '+ dateUpdate;
  //element2.placeholder = "Empty Sticky Note";


  return element2;
}

function addNote() {
  const dateCreation= new Date().toLocaleString();
  const dateUpdate= new Date().toLocaleString();
  const notes = getNotes();
  const noteObject = {
    id: Math.floor(Math.random() * 100000),
    content: "",
    creationDate: dateCreation,
    dateUpdate: dateUpdate
  };

  const noteElement = createNoteElement(noteObject.id, noteObject.content, noteObject.creationDate, noteObject.dateUpdate);
  notesContainer.insertBefore(noteElement, addNoteButton);

  const noteElement2 = createNoteElement2(noteObject.id, noteObject.content, noteObject.creationDate, noteObject.dateUpdate);
  notesContainer.insertBefore(noteElement2, addNoteButton);
  
  notes.push(noteObject);
  saveNotes(notes);
}

function updateNote(id, newContent) {
  const notes = getNotes();
  const targetNote = notes.filter((note) => note.id == id)[0];

  targetNote.content = newContent;
  targetNote.dateUpdate=new Date().toLocaleString();
  saveNotes(notes);
}

function deleteNote(id, element) {
  const notes = getNotes().filter((note) => note.id != id);

  saveNotes(notes);
  const index = Array.from(
    element.parentElement.children
  ).indexOf(element);
  console.log(index);
  
  
  notesContainer.removeChild(notesContainer.children[index+1]);
  notesContainer.removeChild(notesContainer.children[index]);
  
}
