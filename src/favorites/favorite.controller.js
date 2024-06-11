import { request, response } from "express";
import Favorite from "./favorite.model.js";

// List all favorites with pagination
export const listFavorites = async (req = request, res = response) => {
  try {
    const { limit = 10, from = 0 } = req.query;
    const [total, favorites] = await Promise.all([
      Favorite.countDocuments(),
      Favorite.find().skip(Number(from)).limit(Number(limit)),
    ]);
    res.status(200).json({ total, favorites });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during favorite list." });
  }
};

// Get favorite by ID
export const getFavoriteById = async (req, res) => {
  const id = req.params.id;
  try {
    const favorite = await Favorite.findById(id);
    if (!favorite) {
      return res.status(404).json({ msg: "Favorite not found." });
    }
    res.status(200).json({ favorite });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "An unexpected error occurred during fetching favorite." });
  }
};

// Create a new favorite
export const createFavorite = async (req, res) => {
  const { account_no, favorite_account_no, alias } = req.body;

  try {
    const newFavorite = new Favorite({
      account_no,
      favorite_account_no,
      alias,
    });

    await newFavorite.save();
    res
      .status(201)
      .json({ msg: "Favorite created successfully", favorite: newFavorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error creating the favorite." });
  }
};

// Edit favorite information
export const editFavoriteInfo = async (req, res) => {
  const id = req.params.id;
  const { alias, ...rest } = req.body;

  try {
    const updatedFavorite = await Favorite.findByIdAndUpdate(
      id,
      { alias, ...rest },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      msg: `Favorite successfully updated!`,
      favorite: updatedFavorite,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error updating the favorite." });
  }
};

// Delete favorite
export const deleteFavorite = async (req, res) => {
  const id = req.params.id;

  try {
    await Favorite.findByIdAndDelete(id);
    res.status(200).json({ msg: "Favorite deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error deleting the favorite." });
  }
};
