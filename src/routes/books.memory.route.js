
const books = [];

async function booksMemoryRoute(fastify, options) {

  fastify.get('/', async (request, reply) => {
    return books;
  });

  const getBookSchema = {
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
      },
    },
  };

  fastify.get('/:id', { schema: getBookSchema }, async (request, reply) => {
    return books[id];
  });

  const createBookSchema = {
    body: {
      type: 'object',
      required: ['title', 'author'],
      properties: {
        title: { type: 'string' },
        author: { type: 'string' },
      },
    },
  };

  fastify.post('/', { schema: createBookSchema }, async (request, reply) => {
    // On récupère le contenu de la requête
    const { title, author } = request.body;
    // On construit un nouvel objet book qui contient un id unique, title et author
    const newBook = { id: books.length, title, author };
    // On ajoute le livre à notre tableau books
    books.push(newBook);
    // On renvoie le livre créé avec un code 201 (Created)
    reply.code(201).send(newBook);
  });

  const updateBookSchema = {
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
      },
    },
    body: {
      type: 'object',
      required: ['title', 'author'],
      properties: {
        title: { type: 'string' },
        author: { type: 'string' },
      },
    },
  };

  fastify.put('/:id', { schema: updateBookSchema }, async (request, reply) => {
    const { id } = request.params;
    const { title, author } = request.body;
    for (let i = 0; i < books.length; i++) {
      if (books[i].id === id) {
        books[i].title = title;
        books[i].author = author;
        return reply.code(200).send({ message: 'Book modified' });
      }
    }
    return reply.code(404).send({ error: 'Book not found' });
  });

  const deleteBookSchema = {
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer' },
      },
    },
  };
  fastify.delete('/:id', { schema: deleteBookSchema }, async (request, reply) => {
    const { id } = request.params;
    for (let i = 0; i < books.length; i++) {
      if (books[i].id === id) {
        books.splice(i, 1);
        return reply.code(200).send({ message: 'Book deleted' });
      }
    }
    return reply.code(404).send({ error: 'Book not found' });
  });
}

export default booksMemoryRoute;