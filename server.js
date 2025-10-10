const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb+srv://execom:execompassword@cluster0.5czarph.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Connection successful"))
  .catch((err) => console.log("Errror", err));

const habitSchema = new mongoose.Schema({
  name: String,
  goal: String,
  completed: { type: Boolean, default: false },
});

const Habit = mongoose.model("Habit", habitSchema);

app.get("/habits", async (req, res) => {
  try {
    const habits = await Habit.find();
    res.json(habits);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch habits" });
  }
});

app.post("/habits", async (req, res) => {
  try {
    const newHabit = new Habit(req.body);
    await newHabit.save();
    res.status(201).json(newHabit);
  } catch (err) {
    res.status(500).json({ error: "Failed to create habit" });
  }
});

app.patch("/habits/:id", async (req, res) => {
  try {
    const updatedHabit = await Habit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedHabit);
  } catch (err) {
    res.status(500).json({ error: "Failed to update habit" });
  }
});

app.delete("/habits/:id", async (req, res) => {
  try {
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: "Habit deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete habit" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`${PORT}`));
