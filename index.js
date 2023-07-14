const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

mongoose
  .connect("mongodb://127.0.0.1:27017/songList", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Terhubung ke database MongoDB"))
  .catch((error) => console.error("Koneksi ke database gagal:", error));

const songSchema = new mongoose.Schema({
  Img_url: String,
  Title: String,
  Artists: [String],
  URL: String,
});

const Song = mongoose.model("songs", songSchema);

app.get("/data", (req, res) => {
  // Mengambil data dari koleksi "songs"
  Song.find({})
    .then((songs) => {
      res.render("home.ejs", { songs: songs });
    })
    .catch((error) => {
      console.error("Gagal mengambil data:", error);
      res.status(500).json({ error: "Gagal mengambil data" });
    });
});

app.get("/olahMusic", (req, res) => {
  // Mengambil data dari koleksi "songs"
  Song.find({})
    .then((songs) => {
      res.render("olahMusic.ejs", { songs: songs });
    })
    .catch((error) => {
      console.error("Gagal mengambil data:", error);
      res.status(500).json({ error: "Gagal mengambil data" });
    });
});

// Menambahkan item Music
app.get("/addData", (req, res) => {
  res.render("addData.ejs");
});

app.post("/tambah-data", (req, res) => {
  const { Img_url, Title, Artists, URL } = req.body;

  const newSong = new Song({
    Img_url,
    Title,
    Artists: Artists.split(","), // Mengubah string menjadi array artists
    URL,
  });

  newSong
    .save()
    .then(() => {
      res.redirect("/olahMusic");
    })
    .catch((error) => res.status(400).send("Gagal menambahkan data lagu:", error));
});

app.set("view engine", "ejs");

// Hapus data

app.post("/hapus-data/:id", (req, res) => {
  const { id } = req.params;

  Song.findByIdAndRemove(id)
    .then(() => {
      res.redirect("/olahMusic");
    })
    .catch((error) => res.status(400).send("Gagal menghapus data lagu:", error));
});

//Mengedit Data

app.get("/edit", (req, res) => {
  const songId = req.query.id;
  console.log(songId);

  Song.findById(songId)
    .then((song) => {
      res.render("editData", { song: song });
    })
    .catch((error) => {
      console.error("Gagal mendapatkan data lagu:", error);
      res.redirect("/olahMusic");
    });
});

// Mengedit Data
app.get("/edit/:id", (req, res) => {
  const songId = req.params.id;
  console.log(songId);

  Song.findById(songId)
    .then((song) => {
      res.render("editData", { song: song });
    })
    .catch((error) => {
      console.error("Gagal mendapatkan data lagu:", error);
      res.redirect("/olahMusic");
    });
});

app.post("/edit-data/:id", (req, res) => {
  const songId = req.params.id;
  const updatedData = {
    Img_url: req.body.Img_url,
    Title: req.body.Title,
    Artists: req.body.Artists.split(",").map((artist) => artist.trim()),
    URL: req.body.URL,
  };

  Song.findByIdAndUpdate(songId, updatedData)
    .then(() => {
      res.redirect("/olahMusic");
    })
    .catch((error) => {
      res.redirect("/olahMusic");
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
