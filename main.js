// Handle onSubmit form input
document.addEventListener("DOMContentLoaded", () => {
  const formInput = document.getElementById("inputBook");
  formInput.addEventListener("submit", (e) => {
    e.preventDefault();

    addBook();
    clearInput();
  });

  isStrogeExist()
    ? renderDataFromLocalStorage()
    : popupMessage("Storage tidak support di browser ini", "fail");
});

const clearInput = () => {
  const title = document.getElementById("inputBookTitle");
  const author = document.getElementById("inputBookAuthor");
  const year = document.getElementById("inputBookYear");

  title.value = "";
  author.value = "";
  year.value = "";
};

// Handle addbook
const books = [];
const RENDER_EVENT = "render-event";
const addBook = () => {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const id = generateId();
  const objectBooks = createObjectBooks(id, title, author, year, false);

  books.push(objectBooks);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveToLocalStorage();
  popupMessage("Data berhasil di tambahkan", "success");
};

const generateId = () => +new Date();

const createObjectBooks = (id, title, author, year, isCompleted) => {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
};

// Custom Event for Render Element
document.addEventListener(RENDER_EVENT, () => {
  const inFinishBookLists = document.getElementById("inFinishBookLists");
  inFinishBookLists.innerHTML = "";

  const finishedBookLists = document.getElementById("finishedBookLists");
  finishedBookLists.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = createBookElement(bookItem);
    if (!bookItem.isCompleted) inFinishBookLists.append(bookElement);
    else finishedBookLists.append(bookElement);
  }

  countBook();
});

// Count books
function countBook() {
  const amountAll = document.getElementById("amountAll");
  const amountFinish = document.getElementById("amountFinish");
  const amountUnFinish = document.getElementById("amountUnFinish");

  const totalOfBook = books.length;
  const totalOfFinishedBook = finishedBookLists.children.length;
  const totalOfUnFinishedBook = inFinishBookLists.children.length;

  amountAll.innerText = totalOfBook;
  amountFinish.innerText = totalOfFinishedBook;
  amountUnFinish.innerText = totalOfUnFinishedBook;
}

// handle create element
const createBookElement = (bookObject) => {
  const bookTitle = document.createElement("h4");
  bookTitle.innerText = bookObject.title;

  const bookAuthor = document.createElement("p");
  bookAuthor.innerText = `Penulis : ${bookObject.author}`;

  const realeseYear = document.createElement("p");
  realeseYear.innerText = `Tahun : ${bookObject.year}`;

  const buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("action");

  const bookContainer = document.createElement("article");
  bookContainer.classList.add("book_item");
  bookContainer.setAttribute("id", `book-${bookObject.id}`);
  bookContainer.append(bookTitle, bookAuthor, realeseYear, buttonWrapper);

  if (!bookObject.isCompleted) {
    const buttonFinish = document.createElement("button");
    buttonFinish.classList.add("btn_action", "btn_green");
    const iconCheck = document.createElement("i");
    iconCheck.classList.add("uil", "uil-check-circle");
    const textFinish = "Finish";
    buttonFinish.append(textFinish, iconCheck);

    buttonFinish.addEventListener("click", () => addToFinished(bookObject.id));

    const buttonDelete = document.createElement("button");
    buttonDelete.classList.add("btn_action", "btn_red");
    const iconTrash = document.createElement("i");
    iconTrash.classList.add("uil", "uil-trash");
    const textDelete = "Delete";
    buttonDelete.append(textDelete, iconTrash);

    buttonDelete.addEventListener("click", () => deleteBook(bookObject.id));

    buttonWrapper.append(buttonFinish, buttonDelete);
  } else {
    const buttonUndo = document.createElement("button");
    buttonUndo.classList.add("btn_action", "btn_green");
    const iconUndo = document.createElement("i");
    iconUndo.classList.add("uil", "uil-sync");
    const textUndo = "Undo";
    buttonUndo.append(textUndo, iconUndo);

    buttonUndo.addEventListener("click", () => undoFromFinshed(bookObject.id));

    const buttonDelete = document.createElement("button");
    buttonDelete.classList.add("btn_action", "btn_red");
    const iconTrash = document.createElement("i");
    iconTrash.classList.add("uil", "uil-trash");
    const textDelete = "Delete";
    buttonDelete.append(textDelete, iconTrash);

    buttonDelete.addEventListener("click", () => deleteBook(bookObject.id));

    buttonWrapper.append(buttonUndo, buttonDelete);
  }

  return bookContainer;
};

// Handler add to finished
const addToFinished = (bookId) => {
  const bookTarget = findBook(bookId);
  if (bookTarget === null) return;

  bookTarget.isCompleted = true;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveToLocalStorage();
  popupMessage("Buku berhasil dipindahkan", "success");
};

// Handler undo from finished
const undoFromFinshed = (bookId) => {
  const bookTarget = findBook(bookId);
  if (bookTarget === null) return;

  bookTarget.isCompleted = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveToLocalStorage();
  popupMessage("Buku berhasil dipindahkan", "success");
};

// Handler book by Id
const findBook = (bookId) => {
  for (const bookItem of books) {
    if (bookItem.id === bookId) return bookItem;
  }
  return null;
};

// Handler delete books by Id
const deleteBook = (bookId) => {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveToLocalStorage();
  popupMessage("Buku berhasil dihapus", "fail");
};

// Handler find index of book
const findBookIndex = (bookid) => {
  for (const index in books) {
    if (books[index].id === bookid) return index;
  }
  return -1;
};

// handler search
const searchBook = document.getElementById("searchBook");
const inputSearch = document.getElementById("searchBookTitle");

searchBook.addEventListener("submit", (e) => {
  e.preventDefault();

  filterBook;

  inputSearch.value = "";
});

inputSearch.addEventListener("keyup", filterBook);

function filterBook(e) {
  const query = e.target.value.toLowerCase();
  const bookItem = document.querySelectorAll(".book_item");

  bookItem.forEach((book) => {
    const bookList = book.firstChild.textContent.toLowerCase();
    if (bookList.indexOf(query) !== -1) {
      book.setAttribute("style", "display:block;");
    } else {
      book.setAttribute("style", "display:none;");
    }
  });
}

// Handle Local Storage
const STORAGE_KEY = "BOOK_DATA";
const saveToLocalStorage = () => {
  if (isStrogeExist()) {
    const parsedData = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsedData);
  }
};

const isStrogeExist = () => {
  if (typeof Storage === undefined) {
    alert("Browser kamu belum support local storage");

    return false;
  }
  return true;
};

// render from local storage
const renderDataFromLocalStorage = () => {
  const dataFromStorage = localStorage.getItem(STORAGE_KEY);
  const bookData = JSON.parse(dataFromStorage);

  if (bookData !== null) {
    for (const book of bookData) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};

// Create Popup message
const popupMessage = (message, status = "default") => {
  const popupBox = document.createElement("div");
  popupBox.setAttribute("id", "popup");
  popupBox.classList.add("show");
  popupBox.innerText = message;
  switch (status) {
    case "success":
      popupBox.style.backgroundColor = "#2de02d";
      popupBox.style.color = "#fdfdfd";
      break;
    case "fail":
      popupBox.style.backgroundColor = "#fd3333";
      popupBox.style.color = "#fdfdfd";
      break;

    default:
      popupBox.style.backgroundColor = "#fff";
      popupBox.style.color = "#010101";
      break;
  }
  setTimeout(() => popupBox.classList.remove("show"), 2500);
  return document.body.append(popupBox);
};
