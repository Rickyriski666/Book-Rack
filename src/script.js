const booksData = [];
const STORAGE_KEY = 'BOOKRACK';
const RENDER_BOOK = 'render-book';

const addButton = document.getElementById('addButton');
const formAdd = document.getElementById('formAdd');
addButton.addEventListener('click', () => {
  if (formAdd.style.display === 'none') {
    formAdd.style.display = 'block';
  } else {
    formAdd.style.display = 'none';
  }
});

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert('Browser Is Not Support');
    return false;
  }

  return true;
};

const saveData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(booksData);
    localStorage.setItem(STORAGE_KEY, parsed);
    console.log('Saved Success');
    document.dispatchEvent(new Event(RENDER_BOOK));
  }
};

const loadData = () => {
  const dataFromStorage = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(dataFromStorage);

  if (data !== null) {
    for (const book of data) {
      booksData.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_BOOK));
};

const deleteBook = (id) => {
  const index = booksData.findIndex((book) => book.id === id);

  if (index !== -1) {
    booksData.splice(index, 1);
    saveData();
    document.dispatchEvent(new Event(RENDER_BOOK));
  } else {
    console.log(`Book with id: ${id} not found`);
  }
};

const doneBook = (id) => {
  const book = booksData.find((book) => book.id === id);

  if (book) {
    book.isComplete = true;
    saveData();
    document.dispatchEvent(new Event(RENDER_BOOK));
  } else {
    console.log(`Book with id: ${id} not found`);
  }

  console.log(book);
};

const UndoneBook = (id) => {
  const book = booksData.find((book) => book.id === id);

  if (book) {
    book.isComplete = false;
    saveData();
    document.dispatchEvent(new Event(RENDER_BOOK));
  } else {
    console.log(`Book with id: ${id} not found`);
  }

  console.log(book);
};

const editData = (id) => {
  const book = booksData.find((book) => book.id === id);

  const title = document.getElementById('title');
  const author = document.getElementById('author');
  const year = document.getElementById('year');
  const isComplete = document.getElementById('isComplete');

  title.value = book.title;
  author.value = book.author;
  year.value = book.year;
  isComplete.checked = book.isComplete;

  formAdd.style.display = 'block';

  const saveButton = document.getElementById('save');
  saveButton.style.display = 'none';

  const editButton = document.getElementById('edit');
  editButton.style.display = 'block';

  editButton.addEventListener('click', () => {
    const updatedBook = {
      ...book,
      title: title.value,
      author: author.value,
      year: parseInt(year.value),
      isComplete: isComplete.checked
    };

    const index = booksData.findIndex((b) => b.id === book.id);

    if (index !== -1) {
      booksData[index] = updatedBook;
    }

    saveData();

    document.dispatchEvent(new Event(RENDER_BOOK));
  });

  console.log(book);
};

const bookList = (books) => {
  const unreadBook = document.getElementById('unread');
  const readBook = document.getElementById('read');

  unreadBook.innerHTML = '';
  readBook.innerHTML = '';

  books.map((book) => {
    const bookTitle = document.createElement('h4');
    bookTitle.innerText = book.title;
    bookTitle.classList.add('title-book');

    const bookYear = document.createElement('h4');
    bookYear.innerText = book.year;
    bookYear.classList.add('year-book');

    const bookAuthor = document.createElement('h4');
    bookAuthor.innerText = book.author;
    bookAuthor.classList.add('author-book');

    const editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.classList.add('btn-card');
    editButton.setAttribute('id', 'edit');
    editButton.addEventListener('click', () => {
      console.log(book.id);
      editData(book.id);
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';
    deleteButton.classList.add('btn-card');
    deleteButton.setAttribute('id', 'delete');

    deleteButton.addEventListener('click', () => {
      deleteBook(book.id);
    });

    const doneButton = document.createElement('button');
    doneButton.innerText = 'Done';
    doneButton.classList.add('btn-card');
    doneButton.setAttribute('id', 'done');

    doneButton.addEventListener('click', () => {
      doneBook(book.id);
    });

    const undoneButton = document.createElement('button');
    undoneButton.innerText = 'Undone';
    undoneButton.classList.add('btn-card');
    undoneButton.setAttribute('id', 'Undone');

    undoneButton.addEventListener('click', () => {
      UndoneBook(book.id);
    });

    const detailBook = document.createElement('div');
    detailBook.classList.add('detail-book');
    detailBook.append(bookTitle, bookYear, bookAuthor);

    const button = document.createElement('div');
    button.classList.add('btn');
    book.isComplete
      ? button.append(editButton, deleteButton, undoneButton)
      : button.append(editButton, deleteButton, doneButton);

    const cardBook = document.createElement('li');
    cardBook.classList.add('card-book');
    cardBook.setAttribute('id', `book-${book.id}`);
    cardBook.append(detailBook, button);

    if (book.isComplete) {
      return readBook.append(cardBook);
    } else {
      return unreadBook.append(cardBook);
    }
  });
};

function newBook() {
  const title = document.getElementById('title');
  const author = document.getElementById('author');
  const year = document.getElementById('year');
  const isComplete = document.getElementById('isComplete');

  if (!title.value || !author.value || !year.value) {
    return alert('Masukan Data');
  } else {
    const newBook = {
      id: booksData.length + 1,
      title: title.value,
      author: author.value,
      year: parseInt(year.value),
      isComplete: isComplete.checked
    };

    booksData.push(newBook);

    title.value = '';
    author.value = '';
    year.value = '';
    isComplete.checked = false;
    formAdd.style.display = 'none';

    document.dispatchEvent(new Event(RENDER_BOOK));
    saveData();
  }

  console.log(booksData);
}

const saveButton = document.getElementById('save');
saveButton.addEventListener('click', function (e) {
  e.preventDefault();
  newBook();
});

const cancelButton = document.getElementById('cancel');
cancelButton.addEventListener('click', function (e) {
  e.preventDefault();
  title.value = '';
  author.value = '';
  year.value = '';
  isComplete.checked = false;
  formAdd.style.display = 'none';
});

document.addEventListener(RENDER_BOOK, () => {
  bookList(booksData);
});

document.addEventListener('DOMContentLoaded', () => {
  if (isStorageExist) {
    loadData();
  }
  console.log(booksData);
});
