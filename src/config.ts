import { Dimensions } from "react-native";

export const SCREEN_WIDTH = Dimensions.get("window").width;
export const SCREEN_HEIGHT = Dimensions.get("window").height;

export const UI_TIMESTEP = 1000 / 45;
export const PHYSICS_TIMESTEP = 1000 / 60;

export const TOP_WALL_OFFSET = 300;
export const WALL_WIDTH = 100;

export const BUBBLES_COUNT = 25;
export const BUBBLE_RADIUS = 30;
export const BUBBLE_SPAWN_X = SCREEN_WIDTH / 2 - BUBBLE_RADIUS;
export const BUBBLE_SPAWN_Y = -150;
