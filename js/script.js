const READED_BOOKS_ID = "readed-books";
const UNREADED_LIST_ID = "unreaded-books";
const BOOK_ITEMID = "itemID";
const UNREADED_BOOKS_COUNT_ID = "unreaded-books-count";
const READED_BOOKS_COUNT_ID = "readed-books-count";
let UNREADED_COUNT = 0;
let READED_COUNT = 0;

function addBook() {
  const bookTitle = document.getElementById("book-title").value;
  const bookAuthor = document.getElementById("author-name").value;
  const bookYear = document.getElementById("year").value;
  const bookStatus = document.getElementById("book-status").checked;

  if (bookTitle == "" || bookAuthor == "" || bookYear == "") {
    alert("Ada kolom yang belum diisi 😊");
    return;
  }

  document.getElementById("book-title").value = "";
  document.getElementById("author-name").value = "";
  document.getElementById("year").value = "";
  document.getElementById("book-status").checked = false;

  const book = makeBook(bookTitle, bookAuthor, bookYear, bookStatus);
  const bookObject = composeBookObject(
    bookTitle,
    bookAuthor,
    bookYear,
    bookStatus
  );

  book[BOOK_ITEMID] = bookObject.id;
  books.push(bookObject);

  let listID;
  if (bookStatus) {
    listID = READED_BOOKS_ID;
    READED_COUNT++;
  } else {
    listID = UNREADED_LIST_ID;
    UNREADED_COUNT++;
  }

  const listBook = document.getElementById(listID);

  listBook.append(book);
  updateDataToStorage();
  updateCount();
  emptyState();
}

function alertModal(alertTitle, alertMessage) {
  const alertContainer = document.createElement("div");
  alertContainer.classList.add("w-full", "mt-4");
  alertContainer.innerHTML = `
  <div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

  <div class="fixed z-10 inset-0 overflow-y-auto">
      <div class="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
          <div
              class="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
              <div>
                  <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                      <svg class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                          viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                  </div>
                  <div class="mt-3 text-center sm:mt-5">
                      <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">${alertTitle}
                      </h3>
                      <div class="mt-2">
                          <p class="text-sm text-gray-500">${alertMessage}</p>
                      </div>
                  </div>
              </div>
              <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button type="button"
                      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm">Deactivate</button>
                  <button type="button"
                      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">Cancel</button>
              </div>
          </div>
      </div>
  </div>
</div>
  `;
  return alertModal;
}
function makeBook(bookTitle, bookAuthor, bookYear, bookStatus) {
  const title = document.createElement("h3");
  title.innerText = bookTitle;
  title.classList.add("title");

  const textWrapper = document.createElement("div");
  textWrapper.classList.add("text-wrapper");
  textWrapper.innerHTML = `
    <p class="text-lg font-medium text-gray-900 dark:text-white book-title">${bookTitle}</p>
    <p class="text-sm text-gray-500 dark:text-gray-300 truncate book-author">${bookAuthor}</p>
    <p class="text-sm text-gray-500 dark:text-gray-300 truncate book-year">${bookYear}</p>
  `;

  const author = document.createElement("p");
  author.innerHTML = "Penulis: <span class='penulis'>" + bookAuthor + "</span>";

  const year = document.createElement("p");
  year.innerHTML = "Tahun: <span class='tahun'>" + bookYear + "</span>";

  const button = document.createElement("div");
  button.classList.add("button-wrapper");

  if (!bookStatus)
    button.append(createCheckButton(), createEditButton(), createTrashButton());
  else
    button.append(createUndoButton(), createEditButton(), createTrashButton());

  const container = document.createElement("div");
  container.classList.add("booklist");

  container.append(textWrapper, button);
  return container;
}

function createButton(classButton, iconButton, textButton, eventListener) {
  const button = document.createElement("button");
  button.classList.add(classButton);

  const icon = document.createElement("i");
  icon.classList.add("ml-2", "fas", iconButton);

  button.innerHTML = textButton + icon.outerHTML;

  button.addEventListener("click", function (event) {
    eventListener(event);
  });

  return button;
}

function createCheckButton() {
  return createButton(
    "button-success",
    "fa-check-circle",
    "Selesai baca",
    function (event) {
      addBookToCompleted(event.target.parentElement.parentElement);
    }
  );
}

function createEditButton() {
  return createButton(
    "button-warning",
    "fa-edit",
    "Edit buku",
    function (event) {
      showEditModal(event.target.parentElement.parentElement);
    }
  );
}

function createTrashButton() {
  return createButton(
    "button-danger",
    "fa-trash",
    "Hapus buku",
    function (event) {
      removeBookFromCompleted(event.target.parentElement.parentElement);
    }
  );
}

function createUndoButton() {
  return createButton(
    "button-primary",
    "fa-sync-alt",
    "Baca ulang",
    function (event) {
      undoBookFromCompleted(event.target.parentElement.parentElement);
    }
  );
}

function addBookToCompleted(bookItem) {
  const bookTitle = bookItem.querySelector(".book-title").innerText;
  const bookAuthor = bookItem.querySelector(".book-author").innerText;
  const bookYear = bookItem.querySelector(".book-year").innerText;

  const newBook = makeBook(bookTitle, bookAuthor, bookYear, true);

  const book = findBook(bookItem[BOOK_ITEMID]);
  book.isCompleted = true;
  newBook[BOOK_ITEMID] = book.id;

  const readedBook = document.getElementById(READED_BOOKS_ID);
  readedBook.append(newBook);
  bookItem.remove();

  READED_COUNT++;
  UNREADED_COUNT--;
  updateCount();
  updateDataToStorage();
  emptyState();
}

function showEditModal(bookItem) {
  const book = findBook(bookItem[BOOK_ITEMID]);
  const modalEdit = document.getElementById("modal-edit");
  const closeModal = document.getElementById("close-trigger");

  document.getElementById("edit-book-id").value = bookItem[BOOK_ITEMID];
  document.getElementById("edit-book-title").value = book.title;
  document.getElementById("edit-book-author").value = book.author;
  document.getElementById("edit-book-year").value = book.year;

  closeModal.addEventListener("click", () => {
    modalEdit.classList.add("invisible");
  });

  modalEdit.classList.remove("invisible");
}

function saveEditBook() {
  const modalEdit = document.getElementById("modal-edit");

  const bookId = document.getElementById("edit-book-id").value;
  const bookTitle = document.getElementById("edit-book-title").value;
  const bookAuthor = document.getElementById("edit-book-author").value;
  const bookYear = document.getElementById("edit-book-year").value;

  const bookIndex = findBookIndex(parseInt(bookId));

  books[bookIndex].title = bookTitle;
  books[bookIndex].author = bookAuthor;
  books[bookIndex].year = bookYear;

  refreshDataFromBooks();
  modalEdit.style.display = "none";
  document.body.classList.toggle("overflow");

  updateDataToStorage();
}

function removeBookFromCompleted(bookItem) {
  let statusHapus = confirm("Apa kamu yakin ingin menghapus buku ini?");

  if (!statusHapus) return;

  const bookIndex = findBookIndex(bookItem[BOOK_ITEMID]);
  const bookStatus = books[bookIndex].isCompleted;

  if (bookStatus) {
    READED_COUNT--;
  } else {
    UNREADED_COUNT--;
  }

  books.splice(bookIndex, 1);
  bookItem.remove();

  updateCount();
  updateDataToStorage();
  emptyState();
}

function undoBookFromCompleted(bookItem) {
  const title = bookItem.querySelector(".book-title").innerText;
  const author = bookItem.querySelector(".book-author").innerText;
  const year = bookItem.querySelector(".book-year").innerText;

  const newBook = makeBook(title, author, year, false);

  const book = findBook(bookItem[BOOK_ITEMID]);
  book.isCompleted = false;
  newBook[BOOK_ITEMID] = book.id;

  const unReadedBook = document.getElementById(UNREADED_LIST_ID);
  unReadedBook.append(newBook);
  bookItem.remove();
  READED_COUNT--;
  UNREADED_COUNT++;
  updateCount();
  updateDataToStorage();
  emptyState();
}

function updateCount() {
  document.getElementById(UNREADED_BOOKS_COUNT_ID).innerText = UNREADED_COUNT;
  document.getElementById(READED_BOOKS_COUNT_ID).innerText = READED_COUNT;
}

function emptyState() {
  const unreadedState = document.querySelector("#unreaded-state");
  const readedState = document.querySelector("#readed-state");

  const readedEmptyStateElement = document.createElement("div");
  readedEmptyStateElement.classList.add("list-group-item", "w-full", "mt-4");
  readedEmptyStateElement.innerHTML = `
  <div class="space-y-4 flex flex-col items-center">
  <div class="flex flex-col items-center" id="unread-empty-state">
      <svg xmlns="http://www.w3.org/2000/svg"
          class="h-10 w-10 text-gray-300 dark:text-gray-700" viewBox="0 0 20 20"
          fill="currentColor">
          <path fill-rule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
              clip-rule="evenodd" />
      </svg>
      <p class="text-sm text-gray-300">Data masih kosong.</p>
  </div>
</div>
  `;
  const unreadedEmptyStateElement = document.createElement("div");
  unreadedEmptyStateElement.classList.add("list-group-item", "w-full", "mt-4");
  unreadedEmptyStateElement.innerHTML = `
  <div class="space-y-4 flex flex-col items-center">
  <div class="flex flex-col items-center" id="unread-empty-state">
      <svg xmlns="http://www.w3.org/2000/svg"
          class="h-10 w-10 text-gray-300 dark:text-gray-700" viewBox="0 0 20 20"
          fill="currentColor">
          <path fill-rule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
              clip-rule="evenodd" />
      </svg>
      <p class="text-sm text-gray-300">Data masih kosong.</p>
  </div>
</div>
  `;

  if (UNREADED_COUNT == 0 && unreadedState == null) {
    document.getElementById(UNREADED_LIST_ID).append(readedEmptyStateElement);
  }

  if (UNREADED_COUNT > 0 && unreadedState != null) {
    readedEmptyStateElement.remove();
  }

  if (READED_COUNT == 0 && readedState == null) {
    document.getElementById(READED_BOOKS_ID).append(unreadedEmptyStateElement);
  }

  if (READED_COUNT > 0 && readedState != null) {
    unreadedEmptyStateElement.remove();
  }
}

function refreshDataFromBooks() {
  const unreadedBook = document.getElementById(UNREADED_LIST_ID);
  const readedBook = document.getElementById(READED_BOOKS_ID);

  unreadedBook.innerHTML = "";
  readedBook.innerHTML = "";

  READED_COUNT = 0;
  UNREADED_COUNT = 0;

  for (book of books) {
    const newBook = makeBook(
      book.title,
      book.author,
      book.year,
      book.isCompleted
    );
    newBook[BOOK_ITEMID] = book.id;

    if (book.isCompleted) {
      READED_COUNT++;
      readedBook.append(newBook);
    } else {
      UNREADED_COUNT++;
      unreadedBook.append(newBook);
    }
  }
  updateCount();
  emptyState();
}

function searchBook() {
  const keyword = document.getElementById("input-search").value.toLowerCase();
  const unReadedBook = document.getElementById(UNREADED_LIST_ID);
  let readedBooks = document.getElementById(READED_BOOKS_ID);

  unReadedBook.innerHTML = "";
  readedBooks.innerHTML = "";

  if (keyword == "") {
    refreshDataFromBooks();
    return;
  }

  READED_COUNT = 0;
  UNREADED_COUNT = 0;

  for (book of books) {
    [];
    if (book.title.toLowerCase().includes(keyword)) {
      const newBook = makeBook(
        book.title,
        book.author,
        book.year,
        book.isCompleted
      );
      newBook[BOOK_ITEMID] = book.id;

      if (book.isCompleted) {
        READED_COUNT++;
        readedBooks.append(newBook);
      } else {
        UNREADED_COUNT++;
        unReadedBook.append(newBook);
      }
    }
  }
  updateCount();
  emptyState();
}

document.addEventListener("DOMContentLoaded", function () {
  const inputBukuForm = document.getElementById("book-form");
  const searchBukuForm = document.getElementById("search-book");
  const editBukuForm = document.getElementById("form-edit-buku");

  inputBukuForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  searchBukuForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

  editBukuForm.addEventListener("submit", function (event) {
    event.preventDefault();
    saveEditBook();
  });

  if (isStorageExist()) {
    console.log("local storage is exist");
    loadDataFromStorage();
  }
});

document.addEventListener("ondataloaded", () => {
  refreshDataFromBooks();
});
