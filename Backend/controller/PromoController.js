import PointPromo from "../models/PointPromoModel.js";
import Product from "../models/ProductModel.js";

export const createPointPromo = async (req, res) => {
  const { product_id, point_cost, is_active = true } = req.body;
  try {
    const existingPromo = await PointPromo.findOne({ where: { product_id } });
    if (existingPromo) {
      return res
        .status(400)
        .json({ message: "Promo with this product ID already exists" });
    }

    const promo = await PointPromo.create({
      product_id,
      point_cost,
      is_active,
    });
    res.status(201).json({ message: "Promo created successfully", promo });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create promo", error: err.message });
  }
};

export const getAllPointPromos = async (req, res) => {
  try {
    const promos = await PointPromo.findAll({
      include: {
        model: Product,
        attributes: ["id", "name", "price"],
      },
    });
    res.status(200).json(promos);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch promos", error: err.message });
  }
};

export const updatePointPromo = async (req, res) => {
  const { id } = req.params;
  const { product_id, point_cost, is_active } = req.body;
  try {
    const promo = await PointPromo.findByPk(id);
    if (!promo) return res.status(404).json({ message: "Promo not found" });

    if (product_id) {
      const existingPromo = await PointPromo.findOne({
        where: { product_id, id: { $ne: id } },
      });
      if (existingPromo) {
        return res.status(400).json({
          message: "Another promo with this product ID already exists",
        });
      }
    }

    promo.product_id = product_id ?? promo.product_id;
    promo.point_cost = point_cost ?? promo.point_cost;
    promo.is_active = is_active ?? promo.is_active;

    await promo.save();
    res.status(200).json({ message: "Promo updated", promo });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update promo", error: err.message });
  }
};

export const deletePointPromo = async (req, res) => {
  const { id } = req.params;
  try {
    const promo = await PointPromo.findByPk(id);
    if (!promo) return res.status(404).json({ message: "Promo not found" });

    await promo.destroy();
    res.status(200).json({ message: "Promo deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete promo", error: err.message });
  }
};

//get promo by id

export const getPromoById = async (req, res) => {
  const { id } = req.params;
  try {
    const promo = await PointPromo.findByPk(id);
    if (!promo) return res.status(404).json({ message: "Promo not found" });

    res.status(200).json(promo);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch promo", error: err.message });
  }
};
