
import { Spring } from "framer-motion";

export const COSMOS_SPRING: Spring = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 1,
};

export const MAGNETIC_SPRING: Spring = {
  type: "spring",
  stiffness: 400,
  damping: 20,
};

export const LIQUID_SPRING: Spring = {
  type: "spring",
  stiffness: 100,
  damping: 30,
};
