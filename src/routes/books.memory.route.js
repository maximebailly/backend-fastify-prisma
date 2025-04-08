
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
      const book = books.find(book => book.id === parseInt(request.params.id));
      if (!book) {
        reply.code(404).send({ error: 'Book not found' });
      }
      return book;
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
      const { title, author } = request.body;
      if (!title || !author) {
        reply.code(400).send({ error: 'Title and author are required' });
        return;
      }
      const book = { id: books.length + 1, title, author };
      books.push(book);
      reply.code(201).send(book);
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
      const { title, author } = request.body;
      try {
        const book = books.find(book => book.id === parseInt(request.params.id));
        if (!book) {
          reply.code(404).send({ error: 'Book not found' });
          return;
        }
        book.title = title;
        book.author = author;
        return book;
      } catch {
        reply.code(404).send({ error: 'Book not found' });
      }
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
      try {
        const index = books.findIndex(book => book.id === parseInt(request.params.id));
        if (index === -1) {
          reply.code(404).send({ error: 'Book not found' });
          return;
        }
        books.splice(index, 1);
        reply.code(204).send();
      } catch {
        reply.code(404).send({ error: 'Book not found' });
      }
    });
  }

  export default booksMemoryRoute;