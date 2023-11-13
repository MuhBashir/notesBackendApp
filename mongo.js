const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://mbashiribrahim7:${password}@cluster0.t1znl18.mongodb.net/notesApp?retryWrites=true&w=majority`;

mongoose.set('strictQuery');
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

Note.find({}).then((result) => {
  result.map((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});
